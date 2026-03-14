import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <section className="relative mx-auto w-[min(var(--max-width),calc(100%-2rem))] overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),linear-gradient(135deg,rgba(16,52,67,0.88),rgba(31,111,120,0.82))] px-[clamp(2rem,4vw,3.5rem)] py-[clamp(2rem,4vw,3.5rem)] text-white before:absolute before:bottom-[-35%] before:right-[-15%] before:aspect-square before:w-[280px] before:rounded-full before:bg-white/10 before:content-[''] max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
          <div className="relative z-[1] grid max-w-[720px] gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-white/15 text-white hover:bg-white/15">{flashcardSet.card_count} cards</Badge>
              <Badge className="bg-white/15 text-white hover:bg-white/15">{flashcardSet.estimated_minutes} min</Badge>
              <Badge className="bg-white/15 text-white hover:bg-white/15">{flashcardSet.visibility}</Badge>
            </div>
            <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.3rem,5vw,4.4rem)] leading-[0.98]">
              {flashcardSet.title}
            </h1>
            <p className="m-0 leading-[1.7] text-white/80">
              {flashcardSet.description || "Flashcard set ini siap dipelajari langsung dari halaman ini."}
            </p>
            <div>
              <Button asChild variant="secondary">
                <Link href="/courses">
                  <ArrowLeft className="h-4 w-4" />
                  Back to courses
                </Link>
              </Button>
            </div>
          </div>
        </section>

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
      </main>
    );
  } catch {
    notFound();
  }
}
