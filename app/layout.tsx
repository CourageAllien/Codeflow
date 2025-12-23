import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ColdFlow — The Cold Email Command Center",
  description: "Stop switching between 8 tabs. Run your entire cold email operation from one command line.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for Clerk keys at build time
  const hasClerkKeys = 
    typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'undefined' && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== '' &&
    typeof process.env.CLERK_SECRET_KEY !== 'undefined' && 
    process.env.CLERK_SECRET_KEY !== '';

  let Provider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  
  if (hasClerkKeys) {
    try {
      const { ClerkProvider } = require("@clerk/nextjs");
      Provider = ClerkProvider;
    } catch (e) {
      // Clerk not available, use default
      console.warn("Clerk keys found but package not available");
    }
  }

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

