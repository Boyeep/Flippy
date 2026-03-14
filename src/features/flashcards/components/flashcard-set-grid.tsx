import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FlashcardSet } from "@/types/flashcard";
import { FlashcardSetCard } from "@/features/flashcards/components/flashcard-set-card";

type FlashcardSetGridProps = {
  flashcardSets: FlashcardSet[];
};

export function FlashcardSetGrid({ flashcardSets }: FlashcardSetGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
      {flashcardSets.length > 0 ? (
        flashcardSets.map((flashcardSet) => <FlashcardSetCard key={flashcardSet.id} flashcardSet={flashcardSet} />)
      ) : (
        <Card className="rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-[var(--shadow)]">
          <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
            <p className="text-[var(--muted-text)]">Belum ada flashcard set publik yang siap dipelajari.</p>
            <Button asChild>
              <Link href="/create-flashcard">Create flashcard</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
