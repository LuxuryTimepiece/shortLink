import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardClient } from "@/components/dashboard-client";
import connectDB from "@/lib/mongodb";
import URL from "@/models/URL";

/**
 * Dashboard Page Component
 * 
 * Server Component that fetches recent links from database
 * - Fetches data on the server (faster, more secure)
 * - No loading spinners needed (data ready before page renders)
 * - SEO-friendly (if we add meta tags later)
 * 
 * Note: In a real app with auth, we'd filter by userId
 * For MVP, we show all recent links (or filter client-side with localStorage)
 */
export default async function DashboardPage() {
  let recentUrls: any[] = [];

  try {
    await connectDB();
    
    // Fetch most recent 20 links, sorted by creation date
    // In production with auth, we'd add: .where({ userId: currentUser.id })
    recentUrls = (await URL.find({})
      .sort({ createdAt: -1 }) // -1 = descending (newest first)
      .limit(20)
      .lean()) as any[]; // .lean() returns plain JS objects (faster, no Mongoose overhead)
  } catch (error) {
    console.error("Error fetching URLs:", error);
    // On error, show empty array (will show "No links yet" message)
  }

  // Transform data to be JSON-serializable (dates to strings)
  // This is needed because Server Components can only pass serializable data to Client Components
  const serializedUrls = recentUrls.map((url) => ({
    _id: url._id.toString(),
    longUrl: url.longUrl,
    shortCode: url.shortCode,
    clicks: url.clicks,
    createdAt: url.createdAt.toISOString(),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your shortened links and view click statistics
          </p>
        </div>

        <DashboardClient initialUrls={serializedUrls} />
      </div>
    </div>
  );
}
