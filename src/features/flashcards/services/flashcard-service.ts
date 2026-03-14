import { buildApiUrl } from "@/lib/api";
import type { CreateFlashcardInput, CreateFlashcardSetInput, Flashcard, FlashcardSet } from "@/types/flashcard";

type FlashcardSetResponse = {
  data: FlashcardSet;
};

type FlashcardResponse = {
  data: Flashcard;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T | { error?: string };
  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "error" in payload ? payload.error : undefined;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

export async function createFlashcardSet(accessToken: string, input: CreateFlashcardSetInput): Promise<FlashcardSet> {
  const response = await fetch(buildApiUrl("/flashcard-sets"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(input),
  });

  const payload = await parseResponse<FlashcardSetResponse>(response);
  return payload.data;
}

export async function createFlashcard(accessToken: string, slug: string, input: CreateFlashcardInput): Promise<Flashcard> {
  const response = await fetch(buildApiUrl(`/flashcard-sets/${slug}/cards`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(input),
  });

  const payload = await parseResponse<FlashcardResponse>(response);
  return payload.data;
}
