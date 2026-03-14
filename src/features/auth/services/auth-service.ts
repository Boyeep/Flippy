import { buildApiUrl } from "@/lib/api";
import type { AuthResponse, AuthSession, AuthUser, LoginInput, RegisterInput } from "@/types/auth";

type MeResponse = {
  data: AuthUser;
};

function toSession(response: AuthResponse): AuthSession {
  return {
    accessToken: response.access_token,
    expiresAt: response.expires_at,
    user: response.user,
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T | { error?: string };
  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "error" in payload ? payload.error : undefined;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const response = await fetch(buildApiUrl("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return toSession(await parseJson<AuthResponse>(response));
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  const response = await fetch(buildApiUrl("/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return toSession(await parseJson<AuthResponse>(response));
}

export async function getCurrentUser(accessToken: string): Promise<AuthUser> {
  const response = await fetch(buildApiUrl("/auth/me"), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await parseJson<MeResponse>(response);
  return payload.data;
}
