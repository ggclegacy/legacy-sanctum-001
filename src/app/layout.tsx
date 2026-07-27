import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const siteTitle = "Legacy Sanctum — Private Member Entry";
const siteDescription =
  "A private invitation into Legacy Sanctum and an Atlas-guided preview of the future member intelligence platform.";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "localhost:3000";
  const forwardedProtocol = headerStore.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : host.startsWith("localhost")
        ? "http"
        : "https";

  let metadataBase = new URL("http://localhost:3000");
  try {
    metadataBase = new URL(`${protocol}://${host}`);
  } catch {
    // Keep a valid absolute metadata URL if a development proxy sends a
    // malformed host header.
  }

  return {
    metadataBase,
    title: {
      default: siteTitle,
      template: "%s · Legacy Sanctum",
    },
    description: siteDescription,
    applicationName: "Legacy Sanctum",
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
    icons: {
      icon: "/icon.png",
      apple: "/icon.png",
    },
    openGraph: {
      type: "website",
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: "/og.png",
          width: 1733,
          height: 907,
          alt: "Legacy Sanctum — The Atlas Demonstration: The Connected Man",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
