import { describe, expect, it } from 'vitest';
import { redis } from '../../lib/redis';
import { joinQueueSchema, queueStatusQuerySchema } from './queue.schema';
import crypto from 'node:crypto';

describe('Queue Module Validations & In-Memory Redis', () => {
  it('validasi joinQueueSchema memeriksa climbDate dan memberCount', () => {
    expect(joinQueueSchema.safeParse({ climbDate: '2026-11-20', memberCount: 3 }).success).toBe(true);
    expect(joinQueueSchema.safeParse({ climbDate: 'invalid-date', memberCount: 3 }).success).toBe(false);
    expect(joinQueueSchema.safeParse({ climbDate: '2026-11-20', memberCount: 0 }).success).toBe(false);
    expect(joinQueueSchema.safeParse({ climbDate: '2026-11-20', memberCount: 60 }).success).toBe(false);
  });

  it('validasi queueStatusQuerySchema memeriksa format date YYYY-MM-DD', () => {
    expect(queueStatusQuerySchema.safeParse({ date: '2026-11-20' }).success).toBe(true);
    expect(queueStatusQuerySchema.safeParse({ date: '20-11-2026' }).success).toBe(false);
  });

  it('mendukung operasi Sorted Set pada antrean Redis (zadd, zrank, zrem, zrange)', async () => {
    const queueKey = `test:queue:${crypto.randomUUID()}`;
    const user1 = 'user-1';
    const user2 = 'user-2';
    const user3 = 'user-3';

    await redis.zadd(queueKey, 100, user1);
    await redis.zadd(queueKey, 200, user2);
    await redis.zadd(queueKey, 300, user3);

    // Cek urutan
    const rank1 = await redis.zrank(queueKey, user1);
    const rank2 = await redis.zrank(queueKey, user2);
    const rank3 = await redis.zrank(queueKey, user3);

    expect(rank1).toBe(0);
    expect(rank2).toBe(1);
    expect(rank3).toBe(2);

    // Ambil top 2
    const top2 = await redis.zrange(queueKey, 0, 1);
    expect(top2).toEqual([user1, user2]);

    // Hapus user1
    await redis.zrem(queueKey, user1);
    const newRank2 = await redis.zrank(queueKey, user2);
    expect(newRank2).toBe(0);

    // Cleanup
    await redis.del(queueKey);
  });

  it('mendukung penyimpanan access token dengan TTL (get, set, del)', async () => {
    const key = `test:access:${crypto.randomUUID()}`;
    const token = crypto.randomUUID();

    await redis.set(key, token, 'EX', 10);
    const fetched = await redis.get(key);
    expect(fetched).toBe(token);

    await redis.del(key);
    const deleted = await redis.get(key);
    expect(deleted).toBeNull();
  });
});
