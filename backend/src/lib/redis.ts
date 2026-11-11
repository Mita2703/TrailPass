import Redis from 'ioredis';
import { env } from '../config/env';

interface MemoryItem {
  value: string;
  expiresAt: number | null; // epoch ms
}

interface MemoryZSetMember {
  score: number;
  member: string;
}

/**
 * In-memory fallback untuk Redis ketika server Redis lokal/offline tidak terhubung.
 * Mendukung get, set, del, zadd, zrank, zrem, zrange, expire.
 */
class MemoryRedisStore {
  private strings = new Map<string, MemoryItem>();
  private zsets = new Map<string, Map<string, number>>();

  private cleanExpired(key: string): boolean {
    const item = this.strings.get(key);
    if (!item) return false;
    if (item.expiresAt !== null && item.expiresAt <= Date.now()) {
      this.strings.delete(key);
      return false;
    }
    return true;
  }

  async get(key: string): Promise<string | null> {
    if (!this.cleanExpired(key)) return null;
    return this.strings.get(key)?.value ?? null;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    let expiresAt: number | null = null;
    if (mode === 'EX' && duration) {
      expiresAt = Date.now() + duration * 1000;
    } else if (mode === 'PX' && duration) {
      expiresAt = Date.now() + duration;
    }
    this.strings.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const k of keys) {
      if (this.strings.delete(k)) count++;
      if (this.zsets.delete(k)) count++;
    }
    return count;
  }

  async exists(...keys: string[]): Promise<number> {
    let count = 0;
    for (const k of keys) {
      if (this.cleanExpired(k) || this.zsets.has(k)) count++;
    }
    return count;
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    let zset = this.zsets.get(key);
    if (!zset) {
      zset = new Map<string, number>();
      this.zsets.set(key, zset);
    }
    const isNew = !zset.has(member);
    zset.set(member, score);
    return isNew ? 1 : 0;
  }

  async zrank(key: string, member: string): Promise<number | null> {
    const zset = this.zsets.get(key);
    if (!zset || !zset.has(member)) return null;

    // Urutkan ascending berdasarkan score
    const sorted = Array.from(zset.entries()).sort((a, b) => a[1] - b[1]);
    const index = sorted.findIndex(([m]) => m === member);
    return index >= 0 ? index : null;
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    const zset = this.zsets.get(key);
    if (!zset) return 0;
    let count = 0;
    for (const m of members) {
      if (zset.delete(m)) count++;
    }
    return count;
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    const zset = this.zsets.get(key);
    if (!zset) return [];
    const sorted = Array.from(zset.entries()).sort((a, b) => a[1] - b[1]);
    const actualStop = stop < 0 ? sorted.length + stop : stop;
    return sorted.slice(start, actualStop + 1).map(([m]) => m);
  }

  async zcard(key: string): Promise<number> {
    return this.zsets.get(key)?.size ?? 0;
  }
}

class RedisService {
  private client: Redis | null = null;
  private memoryFallback = new MemoryRedisStore();
  private isConnected = false;

  constructor() {
    try {
      this.client = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: () => null, // Jangan retry berulang kali jika offline
      });

      this.client.on('connect', () => {
        this.isConnected = true;
      });

      this.client.on('error', () => {
        this.isConnected = false;
      });

      // Hubungkan jika memungkinkan
      this.client.connect().catch(() => {
        this.isConnected = false;
      });
    } catch {
      this.isConnected = false;
    }
  }

  get isReady(): boolean {
    return this.isConnected;
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.get(key);
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    if (this.isConnected && this.client) {
      try {
        if (mode && duration) {
          return await (this.client as any).set(key, value, mode, duration);
        }
        return await this.client.set(key, value);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.set(key, value, mode, duration);
  }

  async del(...keys: string[]): Promise<number> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.del(...keys);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.del(...keys);
  }

  async exists(...keys: string[]): Promise<number> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.exists(...keys);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.exists(...keys);
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.zadd(key, score, member);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.zadd(key, score, member);
  }

  async zrank(key: string, member: string): Promise<number | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.zrank(key, member);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.zrank(key, member);
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.zrem(key, ...members);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.zrem(key, ...members);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.zrange(key, start, stop);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.zrange(key, start, stop);
  }

  async zcard(key: string): Promise<number> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.zcard(key);
      } catch {
        // Fallback
      }
    }
    return this.memoryFallback.zcard(key);
  }
}

export const redis = new RedisService();
