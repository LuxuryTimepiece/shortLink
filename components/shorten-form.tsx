"use client";

import { useState } from "react";
import { shortenUrl, type ShortenResult } from "@/app/actions/shorten";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { Loader2 } from "lucide-react";

/**
 * Shorten Form Component
 * 
 * Client Component because it:
 * - Uses React state (useState hook) to manage form state
 * - Handles user interactions (typing, clicking)
 * - Shows loading states and error messages
 * 
 * Server Actions Integration:
 * - Can call Server Actions directly from Client Components
 * - No need for API routes or fetch() calls
 * - Type-safe and optimized by Next.js
 * - Server Actions run on the server, keeping sensitive logic secure
 */
export function ShortenForm() {
  const [state, setState] = useState<ShortenResult | null>(null);
  const [pending, setPending] = useState(false);

  // Normalizes URL by adding https:// when the user omits a protocol
  function normalizeUrl(input?: string | null) {
    if (!input) return "";
    const trimmed = input.trim();
    // If already has a scheme (http:, https:, ftp:, etc.), leave as-is
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) return trimmed;
    // If looks like localhost or contains a dot (domain), add https://
    if (/^localhost(:\d+)?(\/.*)?$/i.test(trimmed) || trimmed.includes(".")) {
      return `https://${trimmed}`;
    }
    // Otherwise return original (validation will catch invalid values)
    return trimmed;
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState(null);
    // Normalize the longUrl field client-side so users can paste "google.com"
    const raw = formData.get("longUrl") as string | null;
    const normalized = normalizeUrl(raw);
    if (normalized && normalized !== raw) {
      formData.set("longUrl", normalized);
    }

    try {
      const result = await shortenUrl(formData);
      setState(result);
      
      // Store shortCode in localStorage when link is successfully created
      if (result.success && result.shortCode) {
        const stored = localStorage.getItem("myShortCodes") || "[]";
        const codes = JSON.parse(stored);
        if (!codes.includes(result.shortCode)) {
          codes.push(result.shortCode);
          localStorage.setItem("myShortCodes", JSON.stringify(codes));
          // Dispatch event so dashboard can update
          window.dispatchEvent(
            new CustomEvent("linkCreated", { detail: result.shortCode })
          );
        }
      }
    } catch (error) {
      setState({
        success: false,
        error: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <form 
        action={handleSubmit}
        className="flex flex-col sm:flex-row gap-2"
      >
        <Input
          name="longUrl"
          type="text"
          placeholder="Paste your long URL here (example.com or https://example.com)"
          className="flex-1"
          required
          disabled={pending}
          aria-label="Long URL input"
        />
        <Button type="submit" disabled={pending} className="min-w-[120px]">
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Shortening...
            </>
          ) : (
            "Shorten"
          )}
        </Button>
      </form>

      {/* Success Message with Short URL */}
      {state?.success && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">Your short URL:</p>
                <a
                  href={state.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {state.shortUrl}
                </a>
              </div>
              <CopyButton text={state.shortUrl} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {state && !state.success && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{state.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
