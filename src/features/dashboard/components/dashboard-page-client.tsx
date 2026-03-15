"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Eye, Layers3, ShieldAlert, Trash2 } from "lucide-react";
import { canAccessDashboard, getDashboardOwnerEmail } from "@/lib/dashboard-access";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { getAnalyticsOverview } from "@/features/dashboard/services/dashboard-service";
import {
  deleteFlashcard,
  deleteFlashcardSet,
  getFlashcardsBySet,
  getFlashcardSets,
} from "@/features/flashcards/services/flashcard-service";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsOverview } from "@/types/analytics";
import type { Flashcard, FlashcardSet } from "@/types/flashcard";

type OwnedFlashcardSet = FlashcardSet & {
  flashcards: Flashcard[];
};

async function getOwnedFlashcardSets(userId: string): Promise<OwnedFlashcardSet[]> {
  const flashcardSets = await getFlashcardSets();
  const ownedFlashcardSets = flashcardSets.filter((item) => item.owner_id === userId);

  const flashcardsBySet = await Promise.all(
    ownedFlashcardSets.map(async (flashcardSet) => ({
      ...flashcardSet,
      flashcards: await getFlashcardsBySet(flashcardSet.slug),
    }))
  );

  return flashcardsBySet;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DashboardPageClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user, isLoading } = useAuthSession();
  const [actionMessage, setActionMessage] = useState("");

  const canAccess = canAccessDashboard(user);
  const ownerEmail = getDashboardOwnerEmail();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!canAccess) {
      router.replace("/");
    }
  }, [canAccess, isLoading, router, user]);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard", "owned-sets", user?.id],
    queryFn: () => getOwnedFlashcardSets(user!.id),
    enabled: Boolean(user?.id) && canAccess,
  });

  const analyticsQuery = useQuery<AnalyticsOverview>({
    queryKey: ["dashboard", "analytics-overview"],
    queryFn: () => getAnalyticsOverview(accessToken as string),
    enabled: Boolean(accessToken) && canAccess,
  });

  const deleteCardMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!accessToken) {
        throw new Error("Please log in again before deleting flashcards.");
      }

      return deleteFlashcard(accessToken, id);
    },
    onSuccess: async () => {
      setActionMessage("Flashcard deleted.");
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      setActionMessage(error instanceof Error ? error.message : "Failed to delete flashcard.");
    },
  });

  const deleteSetMutation = useMutation({
    mutationFn: async ({ slug }: { slug: string }) => {
      if (!accessToken) {
        throw new Error("Please log in again before deleting a set.");
      }

      return deleteFlashcardSet(accessToken, slug);
    },
    onSuccess: async () => {
      setActionMessage("Flashcard set deleted.");
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      setActionMessage(error instanceof Error ? error.message : "Failed to delete flashcard set.");
    },
  });

  if (isLoading || (user && canAccess && dashboardQuery.isLoading)) {
    return (
      <main className="mx-auto my-6 w-[min(var(--max-width),calc(100%-2rem))] max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
        <Card className="p-8">
          <p className="text-[var(--muted-text)]">Loading dashboard...</p>
        </Card>
      </main>
    );
  }

  if (!user || !canAccess) {
    return (
      <main className="mx-auto my-6 w-[min(var(--max-width),calc(100%-2rem))] max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
        <Card className="border-amber-200 bg-amber-50/90 p-8">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 text-amber-700" />
            <div className="grid gap-3">
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-3xl">Dashboard locked</h1>
                <p className="mt-2 text-sm text-amber-900/80">
                  This page only opens for the dashboard owner account.
                </p>
              </div>
              <p className="text-sm text-amber-900/80">
                Set <code>NEXT_PUBLIC_DASHBOARD_OWNER_EMAIL</code> to your email to enable access.
                {ownerEmail ? ` Current owner email: ${ownerEmail}.` : ""}
              </p>
              <div>
                <Button asChild variant="secondary">
                  <Link href="/">Back home</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    );
  }

  const ownedSets = dashboardQuery.data ?? [];
  const totalCards = ownedSets.reduce((sum, flashcardSet) => sum + flashcardSet.flashcards.length, 0);
  const latestUpdate = ownedSets
    .map((flashcardSet) => flashcardSet.updated_at)
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

  return (
    <main className="mx-auto my-6 grid w-[min(var(--max-width),calc(100%-2rem))] gap-6 max-[720px]:w-[min(var(--max-width),calc(100%-1.25rem))]">
      <section className="rounded-[36px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,rgba(16,52,67,0.94),rgba(31,111,120,0.84))] p-[clamp(1.75rem,4vw,3rem)] text-white shadow-[var(--shadow)]">
        <div className="grid gap-4">
          <Badge className="w-fit rounded-full bg-white/15 px-3 py-1 text-white hover:bg-white/15">Owner Dashboard</Badge>
          <div className="grid gap-3">
            <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,4.25rem)] leading-[0.95]">
              Manage your published flashcards from one private workspace.
            </h1>
            <p className="m-0 max-w-[760px] text-white/80">
              You can review every set you own, delete individual flashcards, remove full sets,
              and monitor the content health of your library.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/create-flashcard">Create new set</Link>
            </Button>
            <Button asChild>
              <Link href="/courses">View public library</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Sets</CardDescription>
            <CardTitle className="flex items-center gap-3 text-4xl">
              <Layers3 className="h-7 w-7 text-[var(--accent-brand)]" />
              {ownedSets.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Flashcards</CardDescription>
            <CardTitle className="flex items-center gap-3 text-4xl">
              <BarChart3 className="h-7 w-7 text-[var(--accent-brand)]" />
              {totalCards}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Last Content Update</CardDescription>
            <CardTitle className="text-xl">{latestUpdate ? formatDate(latestUpdate) : "No updates yet"}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Your Flashcard Sets</CardTitle>
            <CardDescription>Delete single cards or remove the whole set if you want to clean up old content.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {actionMessage ? (
              <p className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-[var(--muted-text)]">
                {actionMessage}
              </p>
            ) : null}
            {dashboardQuery.isError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {dashboardQuery.error instanceof Error ? dashboardQuery.error.message : "Failed to load dashboard data."}
              </p>
            ) : null}
            {ownedSets.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-border bg-white/60 p-6">
                <p className="text-[var(--muted-text)]">No owned public flashcard sets were found yet.</p>
              </div>
            ) : (
              ownedSets.map((flashcardSet) => (
                <div key={flashcardSet.id} className="rounded-[28px] border border-border/70 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="grid gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-[family-name:var(--font-display)] text-2xl">{flashcardSet.title}</h2>
                        <Badge variant="secondary">{flashcardSet.status}</Badge>
                        <Badge variant="outline">{flashcardSet.visibility}</Badge>
                      </div>
                      <p className="max-w-[700px] text-sm text-[var(--muted-text)]">{flashcardSet.description || "No description."}</p>
                      <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted-text)]">
                        {flashcardSet.flashcards.length} cards • updated {formatDate(flashcardSet.updated_at)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setActionMessage("");
                        if (window.confirm(`Delete the full set "${flashcardSet.title}"? This cannot be undone.`)) {
                          deleteSetMutation.mutate({ slug: flashcardSet.slug });
                        }
                      }}
                      disabled={deleteSetMutation.isPending || deleteCardMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete set
                    </Button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {flashcardSet.flashcards.length === 0 ? (
                      <p className="rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted-text)]">
                        This set does not contain any public flashcards yet.
                      </p>
                    ) : (
                      flashcardSet.flashcards.map((flashcard) => (
                        <div
                          key={flashcard.id}
                          className="flex flex-wrap items-start justify-between gap-3 rounded-[22px] border border-border/60 bg-[var(--surface)] px-4 py-4"
                        >
                          <div className="grid max-w-[760px] gap-2">
                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-text)]">
                              Card {flashcard.position}
                            </p>
                            <p className="font-semibold text-[var(--text)]">{flashcard.question}</p>
                            <p className="text-sm text-[var(--muted-text)]">{flashcard.answer}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setActionMessage("");
                              if (window.confirm("Delete this flashcard? This cannot be undone.")) {
                                deleteCardMutation.mutate({ id: flashcard.id });
                              }
                            }}
                            disabled={deleteCardMutation.isPending || deleteSetMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete card
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitors Analytics</CardTitle>
            <CardDescription>Real traffic numbers from the protected analytics backend endpoint.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {analyticsQuery.isError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {analyticsQuery.error instanceof Error ? analyticsQuery.error.message : "Failed to load analytics."}
              </p>
            ) : null}
            {analyticsQuery.isLoading ? (
              <div className="rounded-[28px] border border-border bg-[var(--surface)] p-5">
                <p className="text-sm text-[var(--muted-text)]">Loading analytics overview...</p>
              </div>
            ) : analyticsQuery.data ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                <div className="rounded-[24px] border border-border bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted-text)]">Visitors</p>
                  <p className="mt-2 text-3xl font-semibold">{analyticsQuery.data.visitors}</p>
                </div>
                <div className="rounded-[24px] border border-border bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted-text)]">Pageviews</p>
                  <p className="mt-2 text-3xl font-semibold">{analyticsQuery.data.pageviews}</p>
                </div>
                <div className="rounded-[24px] border border-border bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted-text)]">Views / Visit</p>
                  <p className="mt-2 text-3xl font-semibold">{analyticsQuery.data.views_per_visit}</p>
                </div>
                <div className="rounded-[24px] border border-border bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted-text)]">Bounce Rate</p>
                  <p className="mt-2 text-3xl font-semibold">{analyticsQuery.data.bounce_rate}</p>
                </div>
                <div className="rounded-[24px] border border-border bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted-text)]">Visit Duration</p>
                  <p className="mt-2 text-3xl font-semibold">{analyticsQuery.data.visit_duration}</p>
                </div>
                <div className="rounded-[24px] border border-border bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted-text)]">Window</p>
                  <p className="mt-2 text-2xl font-semibold">{analyticsQuery.data.date_range}</p>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">{analyticsQuery.data.source}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-border bg-[var(--surface)] p-5">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-[var(--accent-brand)]" />
                  <p className="font-semibold">Analytics is not configured yet.</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-text)]">
                  Configure the Plausible tracking script in the frontend and the Plausible API credentials in the
                  backend to start seeing live visitor numbers here.
                </p>
              </div>
            )}
            <div className="rounded-[28px] bg-white p-5">
              <p className="text-sm font-semibold text-[var(--text)]">What you can already see now</p>
              <ul className="mt-3 grid gap-2 text-sm text-[var(--muted-text)]">
                <li>Real visitor, pageview, bounce-rate, and duration numbers when Plausible is configured</li>
                <li>Your total number of published sets</li>
                <li>Your total number of visible flashcards</li>
                <li>The last time your content library changed</li>
              </ul>
            </div>
            <p className="text-xs leading-6 text-[var(--muted-text)]">
              The analytics API key stays on the backend only. The dashboard fetches aggregated stats through your
              authenticated owner-only backend route.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
