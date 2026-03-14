import { ReactNode } from "react";
import { FloatingActionLink } from "@/components/floating-action-link";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type RootShellProps = {
  children: ReactNode;
};

export function RootShell({ children }: RootShellProps) {
  return (
    <Providers>
      <div className="page-shell">
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingActionLink />
      </div>
    </Providers>
  );
}
