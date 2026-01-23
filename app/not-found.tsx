import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-xl text-center p-8">
        <h1 className="text-4xl font-extrabold mb-4">Link not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The short link you followed doesn&apos;t exist or has been removed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
