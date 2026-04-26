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
          position="bottom-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#ffffff',
              color: '#09090b',
              border: '1px solid #d4d4d8',
              borderRadius: '16px',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontWeight: '500',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
