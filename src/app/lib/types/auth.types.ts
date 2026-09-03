export interface JWTPayload {
  id?: string;
  _id?: string;
  name?: string;
  role?: string;
  email?: string;
  exp?: number;
  iat?: number;
}

export interface UserSession {
  name: string;
  email: string;
  role?: string;
  id?: string;
}

export interface AuthApiResponse {
  message?: string;
  token?: string;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
}
