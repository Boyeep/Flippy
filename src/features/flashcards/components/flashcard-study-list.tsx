import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Flashcard } from "@/types/flashcard";

type FlashcardStudyListProps = {
  flashcards: Flashcard[];
};

export function FlashcardStudyList({ flashcards }: FlashcardStudyListProps) {
  return (
    <section className="mx-auto mt-12 grid w-[min(var(--max-width),calc(100%-2rem))] gap-5 max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
      {flashcards.length > 0 ? (
        flashcards.map((flashcard) => (
          <Card key={flashcard.id} className="rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-[var(--shadow)]">
            <CardContent className="p-0">
              <div className="mb-3 flex items-center justify-between gap-4">
                <Badge variant="outline">Card {flashcard.position}</Badge>
              </div>
              <h2 className="mb-3 font-[family-name:var(--font-display)] text-2xl">Question</h2>
              <p className="mb-6 leading-[1.75] text-[var(--text)]">{flashcard.question}</p>
              <h3 className="mb-3 text-lg font-semibold">Answer</h3>
              <p className="leading-[1.75] text-[var(--muted-text)]">{flashcard.answer}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-[var(--shadow)]">
          <CardContent className="flex min-h-40 items-center justify-center text-[var(--muted-text)]">
            Flashcard set ini belum punya kartu yang bisa dipelajari.
          </CardContent>
        </Card>
      )}
    </section>
  );
}
