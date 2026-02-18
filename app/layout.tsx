import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Making Game",
  description: "Learn to make markets by trading with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
