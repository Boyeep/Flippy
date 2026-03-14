import { fetchJson } from "@/lib/api";
import type { Course } from "@/types/course";

type CourseListResponse = {
  data: Course[];
};

export async function getCourses(): Promise<Course[]> {
  const response = await fetchJson<CourseListResponse>("/courses");
  return response.data;
}
