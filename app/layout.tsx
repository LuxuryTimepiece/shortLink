import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yakura - URL Shortener",
  description: "Shorten your links and track clicks with Yakura",
};

/**
 * Root Layout Component
 * 
 * This is a Server Component by default (no "use client")
 * Server Components:
 * - Run only on the server, never in the browser
 * - Can directly access databases, file systems, etc.
 * - No JavaScript sent to client = faster page loads
 * - Perfect for layouts, static content, data fetching
 * 
 * The layout wraps all pages and provides:
 * - HTML structure (<html>, <body>)
 * - Theme provider for dark mode
 * - Navigation header
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                Yakura
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm hover:underline"
                >
                  Dashboard
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
