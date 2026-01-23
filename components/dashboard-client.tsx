"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { ExternalLink, TrendingUp } from "lucide-react";

interface UrlData {
  _id: string;
  longUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

interface DashboardClientProps {
  initialUrls: UrlData[];
}

/**
 * Dashboard Client Component
 * 
 * Why split Server + Client components?
 * - Server Component (dashboard/page.tsx) fetches data
 * - Client Component (this file) handles interactivity:
 *   - localStorage to track "my links" (MVP, no auth yet)
 *   - Copy buttons
 *   - Filtering by "my links"
 * 
 * localStorage:
 * - Browser storage that persists across sessions
 * - Only available in Client Components (needs window object)
 * - We store an array of shortCodes that "belong" to the user
 * - In production, this would be replaced with user authentication
 */
export function DashboardClient({ initialUrls }: DashboardClientProps) {
  const [myLinks, setMyLinks] = useState<string[]>([]);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  // Load "my links" from localStorage on component mount
  // useEffect runs after component renders (side effect)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("myShortCodes");
      if (stored) {
        try {
          setMyLinks(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing localStorage:", e);
        }
      }
    }
  }, []);

  // Listen for new links being created
  // When a link is shortened, we store it in localStorage
  useEffect(() => {
    const handleNewLink = (event: CustomEvent<string>) => {
      const newCode = event.detail;
      setMyLinks((prev) => {
        const updated = [...prev, newCode];
        if (typeof window !== "undefined") {
          localStorage.setItem("myShortCodes", JSON.stringify(updated));
        }
        return updated;
      });
    };

    window.addEventListener("linkCreated" as any, handleNewLink);
    return () => {
      window.removeEventListener("linkCreated" as any, handleNewLink);
    };
  }, []);

  // Filter URLs based on "show only mine" toggle
  const displayedUrls = showOnlyMine
    ? initialUrls.filter((url) => myLinks.includes(url.shortCode))
    : initialUrls;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Links</CardDescription>
            <CardTitle className="text-3xl">{initialUrls.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>My Links</CardDescription>
            <CardTitle className="text-3xl">{myLinks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Clicks</CardDescription>
            <CardTitle className="text-3xl">
              {initialUrls.reduce((sum, url) => sum + url.clicks, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showOnlyMine"
          checked={showOnlyMine}
          onChange={(e) => setShowOnlyMine(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="showOnlyMine" className="text-sm cursor-pointer">
          Show only my links
        </label>
      </div>

      {/* Links List */}
      {displayedUrls.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {showOnlyMine
                ? "You haven't created any links yet. Start shortening URLs!"
                : "No links yet. Start shortening URLs on the home page!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedUrls.map((url) => {
            const shortUrl = `${baseUrl}/${url.shortCode}`;
            return (
              <Card key={url._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {shortUrl}
                        </a>
                      </CardTitle>
                      <CardDescription className="break-all">
                        {url.longUrl}
                      </CardDescription>
                    </div>
                    <CopyButton text={shortUrl} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        Created: {new Date(url.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <a
                      href={url.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
