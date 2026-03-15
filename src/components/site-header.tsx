"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut, Menu } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useUiStore } from "@/features/shared/store/ui-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { canAccessDashboard } from "@/lib/dashboard-access";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { user, isLoading } = useAuthSession();
  const showDashboardLink = canAccessDashboard(user);

  function handleLogout() {
    clearSession();
    void queryClient.invalidateQueries({ queryKey: ["auth"] });
  }

  return (
    <header className="sticky top-0 z-30 py-4">
      <div className="mx-auto flex w-[min(var(--max-width),calc(100%-2rem))] items-center justify-between gap-4 rounded-full border border-white/60 bg-[#fffaf2c7] px-4 py-3 shadow-[0_14px_32px_rgba(31,41,55,0.08)] backdrop-blur-[18px] max-[900px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
        <Link
          href="/"
          className="inline-flex items-center gap-3 font-[family-name:var(--font-display)] text-[1.4rem] font-bold tracking-[-0.03em]"
        >
          <Badge variant="secondary" className="rounded-full px-2 py-2">
            <BookOpen className="h-4 w-4" />
          </Badge>
          Flippy
        </Link>
        <nav className="flex items-center gap-1 max-[900px]:hidden" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-3 text-[var(--muted-text)] transition-colors hover:bg-[rgba(31,111,120,0.1)] hover:text-[var(--text)]",
                pathname === item.href && "bg-[rgba(31,111,120,0.1)] text-[var(--text)]"
              )}
            >
              {item.label}
            </Link>
          ))}
          {showDashboardLink ? (
            <Link
              href="/dashboard"
              aria-current={pathname === "/dashboard" ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-3 text-[var(--muted-text)] transition-colors hover:bg-[rgba(31,111,120,0.1)] hover:text-[var(--text)]",
                pathname === "/dashboard" && "bg-[rgba(31,111,120,0.1)] text-[var(--text)]"
              )}
            >
              Dashboard
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-2 max-[900px]:hidden">
          {user ? (
            <>
              <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-[var(--muted-text)]">
                {user.full_name || user.username}
              </span>
              <Button type="button" variant="secondary" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : isLoading ? (
            <span className="rounded-full bg-white/70 px-4 py-2 text-sm text-[var(--muted-text)]">Loading...</span>
          ) : (
            <>
              <Button asChild variant="secondary">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="secondary" className="hidden max-[900px]:inline-flex" aria-label="Toggle navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="grid gap-3 pt-8">
              <div>
                <Badge variant="outline">Navigation</Badge>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl">Move around Flippy</h2>
              </div>
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href} className="rounded-[18px] bg-white px-4 py-4">
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                {showDashboardLink ? (
                  <SheetClose asChild>
                    <Link href="/dashboard" className="rounded-[18px] bg-white px-4 py-4">
                      Dashboard
                    </Link>
                  </SheetClose>
                ) : null}
              </nav>
              <div className="grid gap-3 pt-2">
                {user ? (
                  <>
                    <div className="rounded-[18px] bg-white px-4 py-4 text-sm text-[var(--muted-text)]">
                      Signed in as {user.full_name || user.username}
                    </div>
                    <SheetClose asChild>
                      <Button type="button" variant="secondary" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button asChild variant="secondary">
                        <Link href="/login">Login</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild>
                        <Link href="/signup">Sign up</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
