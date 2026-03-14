import { catalogCourses } from "@/lib/site-data";
import type { Course } from "@/types/course";

export async function getCourses(): Promise<Course[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  return catalogCourses.map(({ title, author, category, summary }) => ({
    title,
    author,
    category,
    summary,
  }));
}
