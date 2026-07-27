import Image from "next/image";

import { signOutMember } from "@/app/member/actions";
import { MemberNav } from "@/components/member/member-nav";
import type { MemberIdentity } from "@/types/member";

export function MemberShell({
  identity,
  children,
  preview = false,
}: {
  identity: MemberIdentity;
  children: React.ReactNode;
  preview?: boolean;
}) {
  return (
    <div className="member-app">
      <aside className="member-rail">
        <div className="member-brand">
          <span className="member-brand__emblem">
            <Image
              src="/icon.png"
              alt=""
              fill
              sizes="52px"
              priority
              unoptimized
            />
          </span>
          <span>
            <strong>Legacy Sanctum</strong>
            <small>Private member system</small>
          </span>
        </div>
        <MemberNav disabled={preview} />
        <div className="member-identity">
          <p>{identity.displayName}</p>
          <span>Member {identity.memberNumber}</span>
          {preview ? (
            <span>Internal preview</span>
          ) : (
            <form action={signOutMember}>
              <button type="submit">Secure sign out</button>
            </form>
          )}
        </div>
      </aside>
      <div className="member-mobile-head">
        <div className="member-brand">
          <span className="member-brand__emblem">
            <Image
              src="/icon.png"
              alt=""
              fill
              sizes="44px"
              priority
              unoptimized
            />
          </span>
          <span>
            <strong>Legacy Sanctum</strong>
            <small>Member {identity.memberNumber}</small>
          </span>
        </div>
      </div>
      <main className="member-main">{children}</main>
      <div className="member-mobile-nav">
        <MemberNav disabled={preview} />
      </div>
    </div>
  );
}
