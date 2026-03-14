import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/features/courses/services/course-service";
import { FlashcardSetGrid } from "@/features/flashcards/components/flashcard-set-grid";
import { getFlashcardSets } from "@/features/flashcards/services/flashcard-service";
import { CourseCardGrid } from "@/features/courses/components/course-card-grid";

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
        <FlashcardSetGrid flashcardSets={flashcardSets} />

        <div className="section-heading">
          <span className="section-heading__eyebrow">All Courses</span>
          <h2>Kumpulan materi yang siap dipelajari sekarang.</h2>
        </div>
        <CourseCardGrid courses={courses} />
      </section>
    </main>
  );
}
