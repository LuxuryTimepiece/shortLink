import mongoose from "mongoose";

/**
 * Robust MongoDB Connection Management
 * - Adds retry with exponential backoff
 * - Adds sensible timeouts for faster failure detection
 * - Avoids throwing at module import time when MONGODB_URI is missing
 * - Exposes helpers: `connectDB`, `getMongoose`, `closeConnection`
 */

const MONGODB_URI = process.env.MONGODB_URI;

// Use a global cache so the connection persists across module reloads
// (especially useful in serverless / dev hot reload environments)
type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached = (global as typeof globalThis & { mongoose?: Cached }).mongoose;
if (!cached) {
  cached = (global as typeof globalThis & { mongoose?: Cached }).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB(options?: {
  maxRetries?: number;
  initialDelayMs?: number;
}): Promise<typeof mongoose> {
  const maxRetries = options?.maxRetries ?? 5;
  const initialDelayMs = options?.initialDelayMs ?? 500;

  if (!MONGODB_URI) {
    const msg =
      "MONGODB_URI is not set. Please set the environment variable and try again.";
    console.error(msg);
    throw new Error(msg);
  }

  // Return cached connection if already established
  if (cached!.conn) {
    return cached!.conn;
  }

  // If there is already a connection promise in flight, reuse it
  if (!cached!.promise) {
    const mongooseOpts = {
      bufferCommands: false,
      // Fail fast during initial connection attempts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    } as any;

    cached!.promise = (async () => {
      let lastError: any = null;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const conn = await mongoose.connect(MONGODB_URI as string, mongooseOpts);
          return conn;
        } catch (err) {
          lastError = err;
          const delay = Math.min(initialDelayMs * Math.pow(2, attempt), 10000);
          console.error(
            `MongoDB connection attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
            err
          );
          // eslint-disable-next-line no-await-in-loop
          await new Promise((res) => setTimeout(res, delay));
        }
      }
      // All retries failed
      throw lastError;
    })();
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    // Reset promise so future calls can retry
    cached!.promise = null;
    console.error("Failed to establish MongoDB connection:", e);
    throw e;
  }

  // Attach helpful listeners for runtime diagnostics
  try {
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
  } catch (e) {
    // Non-fatal: listeners may be attached multiple times in hot reload dev
    console.warn("Could not attach mongoose listeners:", e);
  }

  // Gracefully handle process termination in Node environments
  if (typeof process !== "undefined" && process && (process as any).on) {
    const handleClose = async () => {
      try {
        await mongoose.disconnect();
        // eslint-disable-next-line no-console
        console.log("MongoDB disconnected through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error during MongoDB graceful shutdown:", err);
        process.exit(1);
      }
    };

    // Only attach once to avoid duplicate handlers in dev hot reload
    if (!(process as any).__mongooseHookAttached) {
      (process as any).__mongooseHookAttached = true;
      process.on("SIGINT", handleClose);
      process.on("SIGTERM", handleClose);
    }
  }

  return cached!.conn!;
}

function getMongoose() {
  if (!cached!.conn) {
    throw new Error("MongoDB not connected. Call connectDB() before using the client.");
  }
  return cached!.conn;
}

async function closeConnection() {
  try {
    if (cached!.conn) {
      await mongoose.disconnect();
      cached!.conn = null;
      cached!.promise = null;
    }
  } catch (e) {
    console.error("Error closing MongoDB connection:", e);
    throw e;
  }
}

export { connectDB, getMongoose, closeConnection };
export default connectDB;
