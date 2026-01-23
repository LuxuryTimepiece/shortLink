"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * Theme Provider Component
 * 
 * Wraps the app to enable dark mode support using next-themes
 * The "use client" directive is required because theme switching
 * involves client-side JavaScript (localStorage, DOM manipulation)
 * 
 * In Next.js 15 App Router:
 * - Server Components (default): No JavaScript sent to browser, faster
 * - Client Components ("use client"): Have JavaScript, can use hooks/event handlers
 * - We only use "use client" when absolutely necessary (theme, interactivity)
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
