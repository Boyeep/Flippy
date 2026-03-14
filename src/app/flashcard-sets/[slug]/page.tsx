import { notFound } from "next/navigation";
import { FlashcardStudyHero } from "@/features/flashcards/components/flashcard-study-hero";
import { FlashcardStudyList } from "@/features/flashcards/components/flashcard-study-list";
import { getFlashcardsBySet, getFlashcardSet } from "@/features/flashcards/services/flashcard-service";

type FlashcardSetDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function FlashcardSetDetailPage({ params }: FlashcardSetDetailPageProps) {
  const { slug } = await params;

  try {
    const [flashcardSet, flashcards] = await Promise.all([
      getFlashcardSet(slug),
      getFlashcardsBySet(slug),
    ]);

    return (
      <main className="px-0 pb-20 pt-8">
        <FlashcardStudyHero flashcardSet={flashcardSet} />
        <FlashcardStudyList flashcards={flashcards} />
      </main>
    );
  } catch {
    notFound();
  }
}
