import type { Metadata } from "next";
import { Toaster } from "sonner";
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
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#09090b',
              color: '#fafafa',
              border: '1px solid #3f3f46',
            },
          }}
        />
      </body>
    </html>
  );
}
