import { VerifyEmailPageClient } from "@/features/auth/components/verify-email-page-client";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;

  return <VerifyEmailPageClient token={params.token} email={params.email} />;
}
