import { ShortenForm } from "@/components/shorten-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, BarChart3, Zap, DollarSign } from "lucide-react";

/**
 * Landing Page Component
 * 
 * This is a Server Component (default in Next.js 15 App Router)
 * - No "use client" directive = runs on server only
 * - Can fetch data directly, no API routes needed
 * - Renders faster (no JavaScript needed for initial render)
 * - Perfect for static content like this hero section
 */

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Shorten URLs, Track Clicks
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Create short links instantly. Track clicks. Free forever for small projects.
          </p>

          {/* URL Shortening Form */}
          <div className="mb-16">
            <ShortenForm />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card>
              <CardHeader>
                <Link2 className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Free Shortening</CardTitle>
                <CardDescription>
                  Shorten unlimited URLs with our free tier. No signup required.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Click Tracking</CardTitle>
                <CardDescription>
                  Monitor how many times your links are clicked in real-time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Custom Slugs</CardTitle>
                <CardDescription>
                  Coming soon: Create custom short links (e.g., yakura.com/my-link).
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Pricing Section */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Simple Pricing</CardTitle>
              <CardDescription>
                Choose the plan that works for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Free</h3>
                    <span className="text-2xl font-bold">$0</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>✓ 100 links per month</li>
                    <li>✓ Basic click tracking</li>
                    <li>✓ No expiration</li>
                  </ul>
                </div>

                {/* Pro Plan */}
                <div className="border rounded-lg p-6 border-primary">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Pro</h3>
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    </div>
                    <span className="text-2xl font-bold">$5<span className="text-sm font-normal">/mo</span></span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>✓ Unlimited links</li>
                    <li>✓ Advanced analytics</li>
                    <li>✓ Custom slugs</li>
                    <li>✓ QR code generation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
