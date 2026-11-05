import mongoose from "mongoose";
import dns from "dns";

// DNS Server Configuration
// Local router DNS occasionally fails to resolve MongoDB Atlas SRV records.
// Attempt Google DNS fallback safely.
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Ignore DNS setServers errors in restrictive environments
}

export function getMongoURI() {
  const uri = (
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/ogheavyduty_dev"
  );
  assertDedicatedDatabaseTarget(uri);
  return uri;
}

/**
 * Fail-Closed Infrastructure Target Validator (PHASE 6.3)
 * Guarantees that the application never connects to legacy or unauthorized databases.
 */
export function assertDedicatedDatabaseTarget(uri) {
  if (!uri || typeof uri !== "string") {
    throw new Error("Infrastructure Security Error: Empty or invalid MongoDB connection string.");
  }
  
  const lower = uri.toLowerCase();
  if (lower.includes("jindalcluster") || lower.includes("jindal_admin") || lower.includes("wtdeveloperpankaj")) {
    throw new Error("Security Exception: Attempted connection to unauthorized legacy database is strictly blocked.");
  }

  if (lower.includes("mongodb.net")) {
    const isDedicatedHost = lower.includes("ogcluster0.q2x8zb7.mongodb.net");
    const isDedicatedDb = lower.includes("/og_heavyduty");
    if (!isDedicatedHost || !isDedicatedDb) {
      throw new Error("Security Exception: Remote MongoDB cluster target mismatch. Connection is locked strictly to ogcluster0.q2x8zb7.mongodb.net/og_heavyduty.");
    }
  }
}

const FAILURE_COOLDOWN_MS = 15000; // 15s cooldown to prevent event-loop starvation when DB is offline

// Cache the connection across hot-reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    lastFailureTime: 0,
    lastError: null,
    lastFailedUri: null,
  };
}

/**
 * Programmatic cooldown reset for testing or admin manual reconnect.
 */
export function resetDBCooldown() {
  if (cached) {
    cached.lastFailureTime = 0;
    cached.lastError = null;
    cached.lastFailedUri = null;
    cached.promise = null;
  }
}

/**
 * Mask credentials in MongoDB connection string for safe diagnostic logging.
 * Replaces :password@ with :*****@
 */
export function getMaskedURI(uri = getMongoURI()) {
  if (!uri || typeof uri !== "string") return "[unset]";
  try {
    return uri.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:*****@");
  } catch (err) {
    return "[invalid-uri]";
  }
}

/**
 * Returns true if mongoose has an active open connection.
 */
export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Return safe diagnostic status object without leaking credentials.
 */
export function getDBStatus() {
  const readyState = mongoose.connection.readyState;
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    connected: readyState === 1,
    readyState,
    state: stateMap[readyState] || "unknown",
    maskedUri: getMaskedURI(getMongoURI()),
    lastFailure: cached.lastFailureTime
      ? new Date(cached.lastFailureTime).toISOString()
      : null,
  };
}

/**
 * Standard connectDB: throws if connection fails.
 */
export async function connectDB(customUri) {
  const uri = customUri || getMongoURI();
  assertDedicatedDatabaseTarget(uri);

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Fast-fail if recent connection failure occurred on this same URI within cooldown window
  const now = Date.now();
  if (
    !cached.conn &&
    cached.lastFailureTime &&
    now - cached.lastFailureTime < FAILURE_COOLDOWN_MS &&
    (!cached.lastFailedUri || cached.lastFailedUri === uri)
  ) {
    const remainingSec = Math.ceil(
      (FAILURE_COOLDOWN_MS - (now - cached.lastFailureTime)) / 1000
    );
    const cooldownErr = new Error(
      `MongoDB connection in cooldown (${remainingSec}s remaining). Prior error: ${
        cached.lastError?.message || "connection failed"
      }`
    );
    cooldownErr.code = "DB_COOLDOWN";
    throw cooldownErr;
  }

  // If attempting a different URI or cooldown has elapsed, clear previous failure
  if (cached.lastFailedUri && cached.lastFailedUri !== uri) {
    cached.lastFailureTime = 0;
    cached.lastError = null;
    cached.lastFailedUri = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        cached.lastFailureTime = 0;
        cached.lastError = null;
        cached.lastFailedUri = null;
        return m;
      })
      .catch((err) => {
        cached.lastFailureTime = Date.now();
        cached.lastError = err;
        cached.lastFailedUri = uri;
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}

/**
 * Resilient connectDBSafe: returns null on failure instead of throwing,
 * allowing public routes to seamlessly activate verified static fallback.
 */
export async function connectDBSafe(options = {}) {
  try {
    return await connectDB(options.uri);
  } catch (err) {
    if (options.silent !== true) {
      console.warn(
        `[MongoDB Safe Connect] Database unavailable: ${err.message}. Fallback data layer engaged.`
      );
    }
    return null;
  }
}

export default connectDB;
