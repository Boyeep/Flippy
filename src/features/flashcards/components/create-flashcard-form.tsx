"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFlashcard, createFlashcardSet } from "@/features/flashcards/services/flashcard-service";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { FlashcardBuilderSidebar } from "@/features/flashcards/components/flashcard-builder-sidebar";
import { FlashcardCardStep } from "@/features/flashcards/components/flashcard-card-step";
import { FlashcardSetMetaStep } from "@/features/flashcards/components/flashcard-set-meta-step";
import { Button } from "@/components/ui/button";

type FlashcardMeta = {
  madeBy: string;
  title: string;
  description: string;
  numberOfCards: number;
};

type FlashcardEntry = {
  question: string;
  answer: string;
};

export function CreateFlashcardForm() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState<FlashcardMeta>({
    madeBy: user?.full_name || user?.username || "",
    title: "",
    description: "",
    numberOfCards: 3,
  });
  const [cards, setCards] = useState<FlashcardEntry[]>(
    Array.from({ length: 3 }, () => ({ question: "", answer: "" }))
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error("Please log in first to create a flashcard set.");
      }

      const createdSet = await createFlashcardSet(accessToken, {
        title: meta.title.trim(),
        description: meta.description.trim(),
        visibility: "public",
        status: "published",
        language_code: "id",
        estimated_minutes: Math.max(1, meta.numberOfCards * 2),
      });

      for (const [index, card] of cards.entries()) {
        await createFlashcard(accessToken, createdSet.slug, {
          position: index + 1,
          question: card.question.trim(),
          answer: card.answer.trim(),
        });
      }

      return createdSet;
    },
    onSuccess: (createdSet) => {
      setSuccessMessage(`Flashcard set "${createdSet.title}" berhasil dibuat.`);
      router.push("/courses");
      router.refresh();
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create flashcards.");
    },
  });

  const updateMeta = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const nextValue = name === "numberOfCards" ? Math.max(1, Number(value) || 1) : value;

    setMeta((current) => ({
      ...current,
      [name]: nextValue,
    }));

    if (name === "numberOfCards") {
      setCards((current) => {
        const target = Math.max(1, Number(value) || 1);
        return Array.from({ length: target }, (_, index) => current[index] ?? { question: "", answer: "" });
      });
      setStep((current) => Math.min(current, Math.max(0, Number(value) || 1)));
    }
  };

  const updateCard = (index: number, field: keyof FlashcardEntry, value: string) => {
    setCards((current) =>
      current.map((card, cardIndex) =>
        cardIndex === index ? { ...card, [field]: value } : card
      )
    );
  };

  const handleNext = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (step === 0) {
      if (!meta.title.trim()) {
        setErrorMessage("Flashcard title is required.");
        return;
      }

      if (meta.numberOfCards < 1) {
        setErrorMessage("Number of cards must be at least 1.");
        return;
      }
    }

    if (step > 0) {
      if (!currentCard.question.trim() || !currentCard.answer.trim()) {
        setErrorMessage("Question and answer are required for each card.");
        return;
      }
    }

    if (step < meta.numberOfCards) {
      setStep((current) => current + 1);
      return;
    }

    submitMutation.mutate();
  };

  const currentCard = cards[Math.max(0, step - 1)];

  return (
    <main className="mx-auto my-4 grid w-[min(var(--max-width),calc(100%-2rem))] grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)] gap-5 max-[960px]:grid-cols-1 max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
      <FlashcardBuilderSidebar step={step} cardCount={cards.length} isAuthenticated={Boolean(accessToken)} />

      <section className="rounded-[32px] bg-white/85 p-[clamp(1.5rem,4vw,2rem)] shadow-[var(--shadow)]">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex w-fit rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[0.85rem] font-bold text-[var(--accent-brand)]">
              {step === 0 ? "Set details" : `Card ${step}`}
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)]">
              {step === 0 ? "Create flashcard set" : `Edit flashcard ${step}`}
            </h2>
          </div>
          <Button asChild variant="secondary">
            <Link href="/courses">Cancel</Link>
          </Button>
        </div>
        {errorMessage ? (
          <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
        ) : null}
        {successMessage ? (
          <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        {step === 0 ? (
          <FlashcardSetMetaStep
            meta={meta}
            onChange={updateMeta}
            onContinue={handleNext}
            disabled={!accessToken}
          />
        ) : (
          <FlashcardCardStep
            step={step}
            totalCards={meta.numberOfCards}
            currentCard={currentCard}
            onBack={() => setStep((current) => Math.max(0, current - 1))}
            onNext={handleNext}
            onQuestionChange={(value) => updateCard(step - 1, "question", value)}
            onAnswerChange={(value) => updateCard(step - 1, "answer", value)}
            disabled={!accessToken || submitMutation.isPending}
            isSubmitting={submitMutation.isPending}
          />
        )}
      </section>
    </main>
  );
}
