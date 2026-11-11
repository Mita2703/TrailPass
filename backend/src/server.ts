import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { startBackgroundWorkers, stopBackgroundWorkers } from './jobs/schedulers';

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(`TrailPass API berjalan di http://localhost:${env.PORT}/api/v1`);
  // Jalankan background worker untuk hold expirer dan no-show marker
  startBackgroundWorkers(60_000);
});

async function shutdown() {
  stopBackgroundWorkers();
  server.close(async () => {
    await prisma.$disconnect().catch(() => undefined);
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
