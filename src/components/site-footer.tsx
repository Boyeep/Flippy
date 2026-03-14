export function SiteFooter() {
  return (
    <footer className="px-0 pb-12 pt-4" id="contact">
      <div className="mx-auto flex w-[min(var(--max-width),calc(100%-2rem))] flex-wrap items-center justify-between gap-4 rounded-[32px] bg-[rgba(20,24,36,0.94)] px-6 py-6 text-white/90 max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))] max-[720px]:flex-col max-[720px]:items-start">
        <div className="grid gap-1.5">
          <strong className="font-[family-name:var(--font-display)] text-[1.15rem]">Flippy</strong>
          <span className="text-white/70">Belajar ringkas, visual, dan terasa lebih ringan setiap hari.</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <a className="rounded-full bg-white/10 px-3 py-2" href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="rounded-full bg-white/10 px-3 py-2" href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="rounded-full bg-white/10 px-3 py-2" href="https://whatsapp.com" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a className="rounded-full bg-white/10 px-3 py-2" href="https://youtube.com" target="_blank" rel="noreferrer">
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
