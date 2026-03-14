import { whyChooseUs } from "@/lib/site-data";

export function WhyChooseSection() {
  return (
    <section className="px-0 pt-12">
      <div className="mx-auto grid w-[min(var(--max-width),calc(100%-2rem))] gap-6 rounded-[32px] border border-white/70 bg-white/75 p-[clamp(1.5rem,4vw,2rem)] shadow-[var(--shadow)] max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Why Choose Us</span>
          <h2>Fokus ke pemahaman, bukan sekadar menghafal.</h2>
          <p>
            Setiap bagian dirancang agar belajar terasa lebih cepat dimulai dan
            lebih mudah dipertahankan.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {whyChooseUs.map((feature) => (
            <article key={feature.title} className="rounded-[24px] border border-[rgba(31,41,55,0.06)] bg-white/85 p-4">
              <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-2xl">{feature.icon}</span>
              <h3 className="mb-2 mt-4 text-[1.17rem]">{feature.title}</h3>
              <p className="m-0 leading-[1.65] text-[var(--muted-text)]">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
