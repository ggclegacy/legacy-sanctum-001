import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Legacy Sanctum — Private Member Entry",
    template: "%s · Legacy Sanctum",
  },
  description:
    "A private invitation into Legacy Sanctum, reserved for selected founding members.",
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
};

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
