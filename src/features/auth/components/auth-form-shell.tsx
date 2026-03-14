import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Field = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
};

type SecondaryLink = {
  href: string;
  label: string;
};

type AuthFormShellProps = {
  title: string;
  description: string;
  submitLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  fields: Field[];
  secondaryLink?: SecondaryLink;
};

export function AuthFormShell({
  title,
  description,
  submitLabel,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  fields,
  secondaryLink,
}: AuthFormShellProps) {
  return (
    <main className="mx-auto my-4 grid w-[min(var(--max-width),calc(100%-2rem))] grid-cols-[minmax(300px,0.95fr)_minmax(0,1.05fr)] gap-5 max-[900px]:grid-cols-1 max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
      <section className="grid min-h-[520px] content-end gap-4 rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),linear-gradient(180deg,rgba(16,52,67,0.48),rgba(16,52,67,0.94))] p-[clamp(1.8rem,4vw,3rem)] text-white shadow-[var(--shadow)] max-[900px]:min-h-[320px]">
        <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-2 text-[0.88rem] uppercase tracking-[0.04em]">Flippy Access</span>
        <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4.2rem)] leading-[0.96]">Belajar tetap jalan, progress tetap rapih.</h1>
        <p className="m-0 leading-[1.8] text-white/80">
          Semua halaman akun sekarang punya struktur yang konsisten, lebih mudah
          dipelihara, dan siap dihubungkan ke backend kapan pun.
        </p>
      </section>

      <Card className="rounded-[32px] border border-white/70 bg-white/85 p-[clamp(1.5rem,4vw,2rem)] shadow-[var(--shadow)]">
        <CardHeader className="mb-6 grid gap-2 p-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            {fields.map((field) => (
              <div key={field.id} className="grid gap-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input id={field.id} name={field.id} type={field.type} placeholder={field.placeholder} />
              </div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button type="submit">
                {submitLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
              {secondaryLink ? (
                <Link href={secondaryLink.href} className="font-bold text-[var(--accent-brand)]">
                  {secondaryLink.label}
                </Link>
              ) : null}
            </div>
          </form>
          <p className="mt-5 text-[var(--muted-text)]">
            {footerText} <Link href={footerLinkHref}>{footerLinkLabel}</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
