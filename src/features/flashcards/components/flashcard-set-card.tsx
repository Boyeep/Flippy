import Link from "next/link";
import { PlaceholderArt } from "@/components/ui/placeholder-art";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FlashcardSet } from "@/types/flashcard";

type FlashcardSetCardProps = {
  flashcardSet: FlashcardSet;
};

export function FlashcardSetCard({ flashcardSet }: FlashcardSetCardProps) {
  return (
    <Card className="rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-[var(--shadow)]">
      <div className="mb-4 aspect-[4/3] overflow-hidden rounded-[16px]">
        <PlaceholderArt title={flashcardSet.title} label={`${flashcardSet.card_count} cards`} tone="neutral" />
      </div>
      <CardContent className="p-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-[var(--brand-soft)] text-[var(--brand-deep)]">
            {flashcardSet.visibility}
          </Badge>
          <Badge variant="outline">{flashcardSet.card_count} cards</Badge>
        </div>
        <h3 className="mb-1 text-[1.15rem]">{flashcardSet.title}</h3>
        <p className="mb-4 text-[var(--muted-text)]">
          {flashcardSet.description || "Flashcard set ini siap dipakai untuk belajar."}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-[var(--muted-text)]">{flashcardSet.estimated_minutes} min</span>
          <Button asChild variant="secondary">
            <Link href={`/flashcard-sets/${flashcardSet.slug}`}>Study</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
