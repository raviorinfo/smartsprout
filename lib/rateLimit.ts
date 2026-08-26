/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach per IP address.
 * 
 * NOTE: This is per-process. In a serverless environment (Vercel),
 * each function invocation has its own memory, so this provides 
 * per-instance rate limiting. For stricter global limiting, 
 * use a Redis-based solution (e.g., Upstash).
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  maxRequests: number;     // Maximum requests per window
  windowMs: number;        // Window duration in milliseconds
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;         // Milliseconds until reset
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 20, windowMs: 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  const existing = rateLimitMap.get(key);

  if (!existing || now > existing.resetTime) {
    // New window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: existing.resetTime - now,
    };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetIn: existing.resetTime - now,
  };
}

/**
 * Get a client identifier from a Next.js request.
 * Uses x-forwarded-for header (common in production behind proxies)
 * or falls back to a generic identifier.
 */
export function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "anonymous";
  return ip;
}
