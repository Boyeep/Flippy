import Link from "next/link";
import { PlaceholderArt } from "@/components/ui/placeholder-art";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCourses } from "@/features/courses/services/course-service";
import { getFlashcardSets } from "@/features/flashcards/services/flashcard-service";

export default async function CoursesPage() {
  const courses = await getCourses();
  const flashcardSets = await getFlashcardSets();

  return (
    <main className="px-0 pb-20 pt-8">
      <section className="relative mx-auto w-[min(var(--max-width),calc(100%-2rem))] overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),linear-gradient(135deg,rgba(16,52,67,0.88),rgba(31,111,120,0.82))] px-[clamp(2rem,4vw,3.5rem)] py-[clamp(2rem,4vw,3.5rem)] text-white before:absolute before:bottom-[-35%] before:right-[-15%] before:aspect-square before:w-[280px] before:rounded-full before:bg-white/10 before:content-[''] max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
        <div className="relative z-[1] grid max-w-[620px] gap-4">
          <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-[0.88rem] font-bold uppercase tracking-[0.05em]">Course Library</span>
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.3rem,5vw,4.4rem)] leading-[0.98]">Belajar lebih fokus dengan kartu belajar yang ringkas dan visual.</h1>
          <p className="m-0 leading-[1.7] text-white/80">
            Pilih topik, kerjakan flashcard, lalu lanjutkan ke materi berikutnya
            tanpa kehilangan ritme belajar.
          </p>
          <div>
            <Button asChild>
              <Link href="/create-flashcard">Create flashcard</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid w-[min(var(--max-width),calc(100%-2rem))] gap-6 max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Flashcard Sets</span>
          <h2>Flashcard yang sudah kamu publish muncul dan bisa langsung dipelajari di sini.</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          {flashcardSets.length > 0 ? (
            flashcardSets.map((flashcardSet) => (
              <Card key={flashcardSet.id} className="rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-[var(--shadow)]">
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
            ))
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

        <div className="section-heading">
          <span className="section-heading__eyebrow">All Courses</span>
          <h2>Kumpulan materi yang siap dipelajari sekarang.</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
          {courses.map((course) => (
            <Card key={course.id} className="rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-[var(--shadow)]">
              <div className="mb-4 aspect-[4/3] overflow-hidden rounded-[16px]">
                <PlaceholderArt title={course.title} label={course.category} tone="soft" />
              </div>
              <CardContent className="p-0">
                <h3 className="mb-1 text-[1.15rem]">{course.title}</h3>
                <p className="mb-4 text-[var(--muted-text)]">{course.description}</p>
                <div className="flex items-center justify-between gap-4">
                  <Badge variant="outline" className="bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                    {course.category}
                  </Badge>
                  <Button asChild variant="secondary">
                    <Link href="/create-flashcard">Start</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
