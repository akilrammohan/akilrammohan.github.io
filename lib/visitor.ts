import { kv } from '@vercel/kv';
import { headers } from 'next/headers';

const VISITOR_COUNT_KEY = 'visitor_count';
const INITIAL_COUNT = 42;

const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /node-fetch/i,
  /axios/i,
  /postman/i,
  /insomnia/i,
];

const isBot = (userAgent: string | null): boolean => {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
};

const isProduction = (): boolean => {
  return process.env.VERCEL_ENV === 'production';
};

export const incrementVisitorCount = async (): Promise<number | null> => {
  // Only increment in production
  if (!isProduction()) {
    return null;
  }

  try {
    // Get user-agent for bot detection
    const headersList = await headers();
    const userAgent = headersList.get('user-agent');

    // Skip bots
    if (isBot(userAgent)) {
      return await getVisitorCount();
    }

    // Initialize if key doesn't exist
    const exists = await kv.exists(VISITOR_COUNT_KEY);
    if (!exists) {
      await kv.set(VISITOR_COUNT_KEY, INITIAL_COUNT);
    }

    // Increment and return new count
    const newCount = await kv.incr(VISITOR_COUNT_KEY);
    return newCount;
  } catch {
    // If KV unavailable, return null to hide counter
    return null;
  }
};

export const getVisitorCount = async (): Promise<number | null> => {
  if (!isProduction()) {
    return null;
  }

  try {
    const count = await kv.get<number>(VISITOR_COUNT_KEY);
    return count;
  } catch {
    return null;
  }
};
