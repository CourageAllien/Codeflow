import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ColdFlow — The Cold Email Command Center",
  description: "Stop switching between 8 tabs. Run your entire cold email operation from one command line.",
};

// Conditionally wrap with ClerkProvider only if keys are configured
function ConditionalClerkProvider({ children }: { children: React.ReactNode }) {
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;
  
  if (hasClerkKeys) {
    const { ClerkProvider } = require("@clerk/nextjs");
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ConditionalClerkProvider>{children}</ConditionalClerkProvider>
      </body>
    </html>
  );
}

