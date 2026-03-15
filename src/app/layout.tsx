import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { PlausibleAnalytics } from "@/components/plausible-analytics";
import { VercelAnalytics } from "@/components/vercel-analytics";
import { RootShell } from "@/layouts/root-shell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Flippy",
  description: "Interactive learning platform powered by flashcards and focused study flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
        <RootShell>{children}</RootShell>
        <PlausibleAnalytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
