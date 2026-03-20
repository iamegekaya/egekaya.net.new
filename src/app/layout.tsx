import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "egekaya.net",
  description: "Cyber security engineer and photography portfolio.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
