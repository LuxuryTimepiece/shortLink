"use server";

import { nanoid } from "nanoid";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import URL from "@/models/URL";

/**
 * Server Actions in Next.js 15
 * 
 * What is a Server Action?
 * - Functions that run exclusively on the server
 * - Can be called directly from Client Components (no API route needed!)
 * - Automatically handle form submissions and mutations
 * - Type-safe, secure, and optimized
 * 
 * Why "use server"?
 * - Marks this file/module as server-only code
 * - Prevents accidentally importing server code in client components
 * - Enables Next.js to optimize bundle size
 * 
 * Zod Validation:
 * - Schema-based validation library
 * - TypeScript-first (generates types automatically)
 * - Catches invalid data before it reaches the database
 */

// Define the validation schema
// Zod ensures we only accept valid URLs
const shortenSchema = z.object({
  longUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "URL is required")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          // Ensure it's http or https
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "URL must start with http:// or https://" }
    ),
});

// Normalizes protocol-optional URLs by adding https:// when appropriate
function normalizeUrl(input?: string | null) {
  if (!input) return "";
  const trimmed = input.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) return trimmed;
  if (/^localhost(:\d+)?(\/.*)?$/i.test(trimmed) || trimmed.includes(".")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export type ShortenResult =
  | { success: true; shortUrl: string; shortCode: string }
  | { success: false; error: string };

/**
 * Server Action: shortenUrl
 * 
 * This function:
 * 1. Validates the input URL with Zod
 * 2. Checks if URL already exists in database (optimization)
 * 3. Generates a unique 7-character code with nanoid
 * 4. Saves to MongoDB
 * 5. Returns the short URL
 * 
 * Why nanoid instead of random strings?
 * - nanoid generates URL-safe, unique IDs
 * - Shorter than UUIDs (7 chars vs 36 chars)
 * - Collision-resistant (extremely unlikely to generate duplicates)
 * - Fast and lightweight
 */
export async function shortenUrl(
  formData: FormData
): Promise<ShortenResult> {
  try {
    // Connect to MongoDB (cached connection for serverless)
    await connectDB();

    // Extract and normalize the long URL from form data
    const rawLongUrl = formData.get("longUrl") as string;
    const longUrl = normalizeUrl(rawLongUrl);

    // Validate with Zod - throws error if invalid
    const validationResult = shortenSchema.safeParse({ longUrl });

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0].message,
      };
    }

    const validUrl = validationResult.data.longUrl;

    // Check if this URL was already shortened (optimization)
    // If it exists, return the existing short code instead of creating duplicate
    const existingUrl = await URL.findOne({ longUrl: validUrl });

    if (existingUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      return {
        success: true,
        shortUrl: `${baseUrl}/${existingUrl.shortCode}`,
        shortCode: existingUrl.shortCode,
      };
    }

    // Generate a unique 7-character code
    // nanoid(7) creates codes like "a3b9k2m" - short and URL-safe
    let shortCode: string;
    let isUnique = false;

    // Ensure uniqueness (retry if collision occurs, though extremely unlikely)
    while (!isUnique) {
      shortCode = nanoid(7);
      const existing = await URL.findOne({ shortCode });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create and save the new URL document
    const newUrl = await URL.create({
      longUrl: validUrl,
      shortCode: shortCode!,
      clicks: 0,
      createdAt: new Date(),
    });

    // Build the short URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${newUrl.shortCode}`;

    return {
      success: true,
      shortUrl,
      shortCode: newUrl.shortCode,
    };
  } catch (error: any) {
    // Distinguish common failure modes for better UX
    console.error("Error shortening URL:", error);

    // Missing or invalid DB connection
    if (
      error?.message?.includes("MONGODB_URI") ||
      error?.name === "MongoNetworkError" ||
      error?.name === "MongoServerSelectionError"
    ) {
      return {
        success: false,
        error: "Database connection error. Please try again later.",
      };
    }

    // Duplicate key (very unlikely thanks to the unique shortCode generation loop)
    if (error?.code === 11000) {
      return {
        success: false,
        error: "A collision occurred while generating the short code. Please try again.",
      };
    }

    // Fallback generic error
    return {
      success: false,
      error: "Failed to shorten URL. Please try again.",
    };
  }
}
