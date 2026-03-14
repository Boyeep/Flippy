export type FlashcardSet = {
  id: string;
  owner_id: string;
  course_id?: string;
  slug: string;
  title: string;
  description: string;
  visibility: string;
  status: string;
  language_code: string;
  card_count: number;
  estimated_minutes: number;
  created_at: string;
  updated_at: string;
};

export type Flashcard = {
  id: string;
  flashcard_set_id: string;
  position: number;
  question: string;
  answer: string;
  explanation?: string;
  hint?: string;
  created_at: string;
  updated_at: string;
};

export type CreateFlashcardSetInput = {
  title: string;
  description: string;
  visibility?: "private" | "unlisted" | "public";
  status?: "draft" | "published" | "archived";
  language_code?: string;
  estimated_minutes?: number;
  course_id?: string;
};

export type CreateFlashcardInput = {
  position: number;
  question: string;
  answer: string;
  explanation?: string;
  hint?: string;
};
