import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FlashcardEntry = {
  question: string;
  answer: string;
};

type FlashcardCardStepProps = {
  step: number;
  totalCards: number;
  currentCard: FlashcardEntry;
  onBack: () => void;
  onNext: () => void;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  disabled: boolean;
  isSubmitting: boolean;
};

export function FlashcardCardStep({
  step,
  totalCards,
  currentCard,
  onBack,
  onNext,
  onQuestionChange,
  onAnswerChange,
  disabled,
  isSubmitting,
}: FlashcardCardStepProps) {
  return (
    <form className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`question-${step}`}>Question</Label>
        <Input
          id={`question-${step}`}
          value={currentCard.question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="Enter question"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`answer-${step}`}>Answer</Label>
        <Textarea
          id={`answer-${step}`}
          value={currentCard.answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder="Enter answer"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="secondary" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={disabled}>
          {step === totalCards ? (isSubmitting ? "Submitting..." : "Submit") : "Next card"}
          {step === totalCards ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
