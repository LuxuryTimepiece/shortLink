# Yakura - URL Shortener MVP

A production-ready Bitly-style URL shortener built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS.

## Features

- 🚀 **Instant URL Shortening** - Shorten any URL with a unique 7-character code
- 📊 **Click Tracking** - Monitor how many times your links are clicked
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Beautiful dark theme support
- ⚡ **Fast & Secure** - Built with Next.js 15 Server Components for optimal performance
- 📋 **Copy to Clipboard** - One-click copying of short URLs

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: MongoDB Atlas (Mongoose)
- **ID Generation**: nanoid
- **Validation**: Zod
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works fine)
- Git (for version control)

### Installation

1. **Clone the repository** (or navigate to the project directory)

```bash
cd bitly-clone
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your values:

```env
MONGODB_URI=your_mongodb_connection_string_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Getting MongoDB URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster (if you don't have one)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `yakura`)

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bitly-clone/
├── app/
│   ├── actions/
│   │   └── shorten.ts          # Server Action for URL shortening
│   ├── [shortCode]/
│   │   ├── page.tsx            # Dynamic route for redirects
│   │   └── not-found.tsx       # 404 page for invalid codes
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard page
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── copy-button.tsx         # Copy to clipboard component
│   ├── dashboard-client.tsx    # Dashboard client component
│   ├── shorten-form.tsx        # URL shortening form
│   ├── theme-provider.tsx      # Dark mode provider
│   └── theme-toggle.tsx        # Theme switcher
├── lib/
│   ├── mongodb.ts              # MongoDB connection utility
│   └── utils.ts                # Utility functions
└── models/
    └── URL.ts                  # Mongoose URL model
```

## Key Concepts Explained

### Server Components vs Client Components

**Server Components** (default in Next.js 15):
- Run only on the server
- Can directly access databases, file systems
- No JavaScript sent to browser = faster loads
- Use for: data fetching, layouts, static content

**Client Components** (`"use client"`):
- Run in the browser
- Can use React hooks, event handlers
- Use for: interactivity, forms, state management

### Server Actions

Server Actions allow you to call server functions directly from Client Components, without needing API routes. They're type-safe, secure, and automatically optimized by Next.js.

```typescript
// Server Action (runs on server)
"use server";
export async function shortenUrl(formData: FormData) {
  // Database operations, validation, etc.
}

// Client Component (runs in browser)
"use client";
import { shortenUrl } from "@/app/actions/shorten";
// Can call shortenUrl directly!
```

### Why nanoid?

- **Short**: 7 characters vs 36 for UUIDs
- **URL-safe**: Works in URLs without encoding
- **Collision-resistant**: Extremely unlikely to generate duplicates
- **Fast**: Lightweight and performant

### Connection Pooling for Serverless

In serverless environments (like Vercel), each function invocation is isolated. We cache the MongoDB connection in a global variable to reuse it across requests, improving performance and reducing connection overhead.

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_BASE_URL`: Your Vercel app URL (e.g., `https://yakura.vercel.app`)
5. Click "Deploy"

### Step 3: Update MongoDB Network Access

In MongoDB Atlas:
1. Go to Network Access
2. Add IP Address: `0.0.0.0/0` (allows Vercel's IPs)

### Step 4: Update Environment Variable

After deployment, update `NEXT_PUBLIC_BASE_URL` in Vercel to your actual domain.

## Next Steps

### Planned Features

- [ ] User Authentication (Clerk integration)
- [ ] User-owned links (filter by userId)
- [ ] Advanced Analytics (referrers, locations, devices)
- [ ] Custom Slugs (user-defined short codes)
- [ ] QR Code Generation
- [ ] Link Expiration Dates
- [ ] Password-Protected Links
- [ ] Bulk URL Import
- [ ] API for Developers

### Adding Authentication

To add user authentication with Clerk:

1. Install Clerk:
```bash
npm install @clerk/nextjs
```

2. Wrap your app with ClerkProvider in `app/layout.tsx`

3. Protect routes using Clerk's middleware

4. Update the URL model to include `userId`

5. Filter dashboard links by authenticated user

### Adding Analytics Logging

Create a new collection/model for click analytics:

```typescript
// models/Analytics.ts
{
  shortCode: string;
  clickedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  // ... more fields
}
```

Then log each click in the `/[shortCode]/page.tsx` route.

## Troubleshooting

### MongoDB Connection Issues

- Verify your `MONGODB_URI` is correct
- Check that your MongoDB cluster is running
- Ensure network access allows your IP (or `0.0.0.0/0` for production)

### Build Errors

- Make sure all environment variables are set
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`

### Redirect Not Working

- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check that the shortCode exists in the database
- Look at server logs for errors

## License

MIT

## Contributing

This is an MVP project. Feel free to fork and customize for your needs!
