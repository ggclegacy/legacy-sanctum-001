"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/member", label: "Command", mark: "⌂" },
  { href: "/member/vitality", label: "Vitality", mark: "V" },
  { href: "/member/mindset", label: "Mindset", mark: "M" },
  { href: "/member/brotherhood", label: "Brotherhood", mark: "B" },
  { href: "/member/legacy", label: "Legacy", mark: "L" },
  { href: "/member/atlas", label: "Atlas", mark: "A" },
] as const;

export function MemberNav({ disabled = false }: { disabled?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="member-nav" aria-label="Member navigation">
      {items.map((item) => {
        const active =
          item.href === "/member"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return disabled ? (
          <span className="member-nav__item" key={item.href}>
            <span className="member-nav__mark" aria-hidden="true">
              {item.mark}
            </span>
            <span>{item.label}</span>
          </span>
        ) : (
          <Link
            href={item.href}
            key={item.href}
            className={active ? "member-nav__item is-active" : "member-nav__item"}
            aria-current={active ? "page" : undefined}
          >
            <span className="member-nav__mark" aria-hidden="true">
              {item.mark}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
