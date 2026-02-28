import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Timeline Party Game",
  description: "Shared-screen-first media timeline party game MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

