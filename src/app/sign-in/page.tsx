import type { Metadata } from "next";
import Image from "next/image";

import { SignInForm } from "@/app/sign-in/sign-in-form";

export const metadata: Metadata = {
  title: "Member Access",
};

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; error?: string }>;
}) {
  const params = await searchParams;
  const notice =
    params.reason === "configuration"
      ? "Member access is awaiting secure configuration."
      : params.error === "not-member"
        ? "This account is not connected to an active membership."
        : null;

  return (
    <main className="member-auth-page">
      <div className="ambient-grid" />
      <div className="violet-horizon" />
      <section className="member-auth-card">
        <div className="member-auth-emblem">
          <Image
            src="/icon.png"
            alt="Legacy Sanctum"
            fill
            sizes="160px"
            priority
            unoptimized
          />
        </div>
        <p className="micro-label">Private member access</p>
        <h1>Enter the Sanctum.</h1>
        <p className="member-auth-copy">
          Access is reserved for invited members. Use the email connected to
          your invitation and we will send a secure sign-in link.
        </p>
        {notice ? <p className="member-auth-notice">{notice}</p> : null}
        <SignInForm />
        <p className="member-auth-footnote">
          No password. No public enrollment. Each link is time-limited.
        </p>
      </section>
    </main>
  );
}
