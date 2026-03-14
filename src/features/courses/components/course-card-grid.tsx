import Link from "next/link";
import { PlaceholderArt } from "@/components/ui/placeholder-art";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Course } from "@/types/course";

type CourseCardGridProps = {
  courses: Course[];
};

export function CourseCardGrid({ courses }: CourseCardGridProps) {
  return (
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
  );
}
