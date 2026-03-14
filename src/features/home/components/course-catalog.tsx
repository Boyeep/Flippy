"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { courseCategories } from "@/lib/site-data";
import { PlaceholderArt } from "@/components/ui/placeholder-art";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { useUiStore } from "@/features/shared/store/ui-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CourseCatalog() {
  const { data: courses = [], isLoading } = useCourses();
  const [query, setQuery] = useState("");
  const category = useUiStore((state) => state.selectedCategory);
  const setCategory = useUiStore((state) => state.setSelectedCategory);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = category === "Semua" || course.category === category;
      const matchesQuery =
        query.trim().length === 0 ||
        `${course.title} ${course.author} ${course.category}`
          .toLowerCase()
          .includes(query.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [category, courses, query]);

  return (
    <section className="px-0 pt-12">
      <div className="mx-auto grid w-[min(var(--max-width),calc(100%-2rem))] gap-6 rounded-[32px] border border-white/70 bg-white/75 p-[clamp(1.5rem,4vw,2rem)] shadow-[var(--shadow)] max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="section-heading">
            <span className="section-heading__eyebrow">All Courses</span>
            <h2>Cari materi yang sesuai dengan ritme belajarmu.</h2>
            <p className="m-0 leading-[1.65] text-[var(--muted-text)]">
              Filter cepat untuk membantu kamu langsung masuk ke topik yang ingin dipelajari.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="min-w-[min(320px,100%)] pl-10 max-[720px]:min-w-full"
                type="search"
                placeholder="Cari kursus..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {courseCategories.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {isLoading ? (
            <Card className="rounded-[24px] border border-[rgba(31,41,55,0.06)] bg-white/85 p-4">
              <CardContent className="flex min-h-48 items-center justify-center p-6 text-muted-foreground">
                Loading courses...
              </CardContent>
            </Card>
          ) : null}
          {filteredCourses.map((course) => (
            <Card key={`${course.title}-${course.author}`} className="rounded-[24px] border border-[rgba(31,41,55,0.06)] bg-white/85 p-4">
              <div className="mb-4 aspect-[4/3] overflow-hidden rounded-[16px]">
                <PlaceholderArt title={course.title} label={course.category} tone="neutral" className="h-full w-full" />
              </div>
              <CardContent className="p-0">
                <Badge variant="outline" className="mb-3">
                  {course.category}
                </Badge>
                <h3 className="mb-2 mt-0 text-[1.17rem]">{course.title}</h3>
                <p className="m-0 leading-[1.65] text-[var(--muted-text)]">{course.summary}</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-[0.95rem] text-[var(--muted-text)]">Dibuat oleh {course.author}</span>
                  <Button asChild>
                    <Link href="/create-flashcard">Kerjakan</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && filteredCourses.length === 0 ? (
            <Card className="rounded-[24px] border border-[rgba(31,41,55,0.06)] bg-white/85 p-4">
              <CardContent className="flex min-h-48 items-center justify-center p-6 text-muted-foreground">
                No courses match your search yet.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
