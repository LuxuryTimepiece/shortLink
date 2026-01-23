"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  className?: string;
}

/**
 * Copy Button Component
 * 
 * Client Component that copies text to clipboard
 * Uses the Clipboard API (navigator.clipboard) which is only available in browsers
 * 
 * React State Hook: useState()
 * - Manages component state (data that changes over time)
 * - Returns [currentValue, setterFunction]
 * - When state changes, React re-renders the component
 * 
 * useEffect Hook:
 * - Runs side effects (like timers) after render
 * - Cleanup function (return) runs before next effect or unmount
 */
export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      // Modern Clipboard API (requires HTTPS in production)
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Reset the checkmark after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers (not needed for modern Next.js apps)
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copyToClipboard}
      className={className}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </>
      )}
    </Button>
  );
}
