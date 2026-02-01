import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HeyBio - Beautiful link in bio pages",
  description: "Finally, a bio link that looks good. Create your free page in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
