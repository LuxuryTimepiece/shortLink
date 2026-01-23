import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Not Found Page for Invalid Short Codes
 * 
 * This is a special Next.js convention
 * - If a route throws notFound(), this page is shown
 * - Provides a better UX than a generic 404
 */
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Link Not Found</CardTitle>
          <CardDescription>
            {`This short link doesn't exist or has been removed.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button className="w-full">Create a New Short Link</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
