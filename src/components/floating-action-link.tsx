import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingActionLink() {
  return (
    <Button
      asChild
      className="fixed bottom-4 right-4 z-20 inline-flex items-center gap-3 rounded-full bg-[#111827] px-4 py-3 text-white shadow-[0_18px_40px_rgba(17,24,39,0.28)] hover:bg-[#111827] max-[720px]:px-3"
    >
      <Link href="/create-flashcard">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)]">
          <Plus className="h-4 w-4" />
        </span>
        <span className="max-[720px]:hidden">Create Flashcard</span>
      </Link>
    </Button>
  );
}
