"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFlashcard, createFlashcardSet } from "@/features/flashcards/services/flashcard-service";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
      <aside className="grid content-start gap-4 rounded-[32px] bg-[linear-gradient(180deg,rgba(239,125,87,0.14),rgba(255,255,255,0.84))] p-[clamp(1.5rem,4vw,2rem)] shadow-[var(--shadow)]">
        <span className="section-heading__eyebrow">Flashcard Builder</span>
        <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.3rem,5vw,3.8rem)] leading-[0.98]">Susun materi belajar jadi set kartu yang lebih rapih.</h1>
        <p className="m-0 leading-[1.75] text-[var(--muted-text)]">
          Alur sekarang dipisahkan jelas antara informasi set dan isi kartu,
          jadi lebih gampang dirawat dan lebih enak dipakai.
        </p>
        {!accessToken ? (
          <p className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
            Login dulu supaya flashcard yang kamu buat bisa tersimpan ke backend.
          </p>
        ) : null}
        <div className="grid gap-3">
          <div className={step === 0 ? "rounded-[20px] border border-[rgba(216,95,54,0.2)] bg-[rgba(255,217,191,0.52)] px-4 py-4" : "rounded-[20px] border border-[rgba(31,41,55,0.06)] bg-white/75 px-4 py-4"}>
            <strong>Step 1</strong>
            <p className="m-0 leading-[1.75] text-[var(--muted-text)]">Isi informasi utama flashcard set.</p>
          </div>
          {cards.map((_, index) => (
            <div
              key={`step-${index + 1}`}
              className={step === index + 1 ? "rounded-[20px] border border-[rgba(216,95,54,0.2)] bg-[rgba(255,217,191,0.52)] px-4 py-4" : "rounded-[20px] border border-[rgba(31,41,55,0.06)] bg-white/75 px-4 py-4"}
            >
              <strong>Card {index + 1}</strong>
              <p className="m-0 leading-[1.75] text-[var(--muted-text)]">Tulis pertanyaan dan jawaban singkat.</p>
            </div>
          ))}
        </div>
      </aside>

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
          <form className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
              <div className="grid gap-2">
                <Label htmlFor="madeBy">Made by</Label>
                <Input id="madeBy" name="madeBy" value={meta.madeBy} onChange={updateMeta} placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Flashcard title</Label>
                <Input id="title" name="title" value={meta.title} onChange={updateMeta} placeholder="Enter title" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={meta.description}
                onChange={updateMeta}
                placeholder="What is this flashcard about?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numberOfCards">Number of cards</Label>
              <Input
                id="numberOfCards"
                name="numberOfCards"
                type="number"
                min={1}
                value={meta.numberOfCards}
                onChange={updateMeta}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 leading-[1.75] text-[var(--muted-text)]">Setelah ini kita isi kartu satu per satu.</p>
              <Button type="button" onClick={handleNext} disabled={!accessToken}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`question-${step}`}>Question</Label>
              <Input
                id={`question-${step}`}
                value={currentCard.question}
                onChange={(event) => updateCard(step - 1, "question", event.target.value)}
                placeholder="Enter question"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`answer-${step}`}>Answer</Label>
              <Textarea
                id={`answer-${step}`}
                value={currentCard.answer}
                onChange={(event) => updateCard(step - 1, "answer", event.target.value)}
                placeholder="Enter answer"
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={submitMutation.isPending}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="button" onClick={handleNext} disabled={!accessToken || submitMutation.isPending}>
                {step === meta.numberOfCards ? (submitMutation.isPending ? "Submitting..." : "Submit") : "Next card"}
                {step === meta.numberOfCards ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
