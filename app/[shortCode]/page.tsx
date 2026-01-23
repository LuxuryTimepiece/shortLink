import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import URL from "@/models/URL";

/**
 * Dynamic Route: /[shortCode]
 * 
 * This page handles URL redirects
 * - [shortCode] is a dynamic segment that matches any path
 * - Examples: /a3b9k2m, /xyz1234, etc.
 * 
 * Server Component Benefits:
 * - Runs on server, so redirect happens before page loads
 * - Fast (no client-side JavaScript needed)
 * - SEO-friendly (proper 301 redirect)
 * 
 * How it works:
 * 1. Extract shortCode from URL params
 * 2. Look up in MongoDB
 * 3. Increment click counter (atomic update)
 * 4. Redirect to longUrl with 301 (permanent redirect)
 * 5. Handle not found gracefully
 */
export default async function ShortCodePage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  // In Next.js 15, params is a Promise, so we await it
  const { shortCode } = await params;

  try {
    // Connect to database
    await connectDB();

    // 1) Fetch the document by shortCode first.
    //    We fetch before updating so we can return 404 via `notFound()` when appropriate.
    const urlDoc = (await URL.findOne({ shortCode }).lean()) as any | null;

    // 2) If not found, short-circuit to the 404 page.
    //    Calling `notFound()` in Next.js App Router intentionally throws a special
    //    control-flow error that the framework catches and renders the 404 UI.
    //    This is expected behavior in dev (you'll see NEXT_HTTP_ERROR_FALLBACK logs).
    if (!urlDoc) {
      notFound();
    }

    // 3) Increment clicks atomically. We run an update separately so the increment
    //    is atomic and resilient to concurrent requests. We don't need the updated
    //    document back here, so we use updateOne with $inc for efficiency.
    await URL.updateOne({ shortCode }, { $inc: { clicks: 1 } }).exec();

    // 4) Redirect to the original URL.
    // Note: keep redirect AFTER the notFound() check so the 404 path is reachable.
    // The `redirect()` helper from `next/navigation` triggers a server redirect.
    // If you need an explicit 301 (permanent) redirect for SEO, consider
    // implementing a route handler (`/[shortCode]/route.ts`) that returns
    // `NextResponse.redirect(url, 301)`. For the page-level redirect here we
    // call `redirect()` which is the App Router mechanism for navigation.
    redirect(urlDoc.longUrl);
  } catch (error) {
    console.error("Error redirecting:", error);

    // If it's a DB connectivity issue, surface a server error so it's visible
    // to monitoring and returns a 500 instead of a 404.
    const err: any = error;
    if (
      err?.message?.includes("MONGODB_URI") ||
      err?.name === "MongoNetworkError" ||
      err?.name === "MongoServerSelectionError"
    ) {
      throw new Error("Database connection error. Please try again later.");
    }

    // Otherwise, treat as not found (keeps user-facing response simple)
    notFound();
  }
}
