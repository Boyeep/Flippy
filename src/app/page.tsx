import { AboutSection } from "@/features/home/components/about-section";
import { CourseCatalog } from "@/features/home/components/course-catalog";
import { HeroSection } from "@/features/home/components/hero-section";
import { PopularCourses } from "@/features/home/components/popular-courses";
import { WhyChooseSection } from "@/features/home/components/why-choose-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <WhyChooseSection />
      <PopularCourses />
      <CourseCatalog />
    </main>
  );
}
