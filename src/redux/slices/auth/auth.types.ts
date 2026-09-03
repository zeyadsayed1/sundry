import type { UserSession } from "@/app/lib/types";

export interface AuthState {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface SetCredentialsPayload {
  user: UserSession;
  token: string;
}
