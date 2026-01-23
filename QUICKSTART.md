# Quick Start Guide

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
   
   To get your MongoDB URI:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with your database name (e.g., `yakura`)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing

1. **Shorten a URL**: Enter any URL (e.g., `https://google.com`) and click "Shorten"
2. **Copy the short URL**: Click the "Copy" button
3. **Test redirect**: Open the short URL in a new tab - it should redirect to the original URL
4. **View Dashboard**: Go to `/dashboard` to see all shortened links and click counts

## Common Issues

### Build Fails Without Environment Variables
This is expected. The build process needs the `MONGODB_URI` environment variable. Make sure `.env.local` exists before building.

### MongoDB Connection Error
- Verify your `MONGODB_URI` is correct
- Check that your MongoDB cluster is running
- Ensure network access allows your IP (or `0.0.0.0/0` for all IPs)

## Project Structure Overview

```
app/
├── actions/shorten.ts       # Server Action for URL shortening
├── [shortCode]/page.tsx     # Dynamic route for redirects
├── dashboard/page.tsx       # Dashboard page (Server Component)
├── page.tsx                 # Landing page (Server Component)
└── layout.tsx               # Root layout with navigation

components/
├── ui/                      # shadcn/ui components
├── shorten-form.tsx         # URL shortening form (Client Component)
├── dashboard-client.tsx     # Dashboard client logic (Client Component)
└── copy-button.tsx          # Copy to clipboard component

lib/
└── mongodb.ts               # MongoDB connection (cached for serverless)

models/
└── URL.ts                   # Mongoose URL model schema
```

## Key Learning Points

### Server Components (Default)
- Run only on the server
- Can directly access databases
- No JavaScript sent to browser = faster loads
- Files like `app/page.tsx`, `app/dashboard/page.tsx` are Server Components

### Client Components ("use client")
- Run in the browser
- Use React hooks (useState, useEffect)
- Handle user interactions
- Examples: `components/shorten-form.tsx`, `components/copy-button.tsx`

### Server Actions
- Functions that run on the server
- Called directly from Client Components
- No API routes needed
- Type-safe and secure
- Example: `app/actions/shorten.ts`

## Next Steps

1. Add authentication (Clerk recommended)
2. Add user ownership to URLs
3. Implement custom slugs
4. Add advanced analytics
5. Deploy to Vercel (see README.md)
