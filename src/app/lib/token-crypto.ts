const ENCRYPTED_PREFIX = "enc:v1:";
const IV_LENGTH = 12;

function getPassphrase(): string {
  const key = process.env.NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY;

  if (key && key.length >= 32) {
    return key;
  }

  console.warn(
    "[auth] Set NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY (min 32 chars) in .env.local for production-ready JWT encryption."
  );
  return "sundry-dev-encryption-key-min-32-chars!!";
}

function isPlainJwt(value: string): boolean {
  return value.startsWith("eyJ") && value.split(".").length === 3;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getAesKey(): Promise<CryptoKey> {
  const encoded = new TextEncoder().encode(getPassphrase());
  const hash = await crypto.subtle.digest("SHA-256", encoded);

  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export function isTokenEncrypted(storedValue: string): boolean {
  return storedValue.startsWith(ENCRYPTED_PREFIX);
}

export async function encryptToken(token: string): Promise<string> {
  const key = await getAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encodedToken = new TextEncoder().encode(token);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedToken
  );

  const packed = new Uint8Array(iv.length + cipherBuffer.byteLength);
  packed.set(iv, 0);
  packed.set(new Uint8Array(cipherBuffer), iv.length);

  return `${ENCRYPTED_PREFIX}${bytesToBase64(packed)}`;
}

export async function decryptToken(storedValue: string): Promise<string | null> {
  if (isPlainJwt(storedValue)) {
    return storedValue;
  }

  if (!isTokenEncrypted(storedValue)) {
    return null;
  }

  try {
    const packed = base64ToBytes(storedValue.slice(ENCRYPTED_PREFIX.length));
    if (packed.length <= IV_LENGTH) return null;

    const iv = packed.slice(0, IV_LENGTH);
    const ciphertext = packed.slice(IV_LENGTH);
    const key = await getAesKey();
    const plainBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(plainBuffer) || null;
  } catch {
    return null;
  }
}
