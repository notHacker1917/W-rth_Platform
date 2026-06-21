import { createApp } from './app.js';
import { config } from './lib/config.js';
import { store } from './lib/store.js';

// Touch the store so seeding / db load happens at boot (and fails fast).
void store.data;

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`\n  Würth Platform API`);
  console.log(`  ────────────────────────────────────────`);
  console.log(`  env      : ${config.env}`);
  console.log(`  port     : ${config.port}`);
  console.log(`  api base : http://localhost:${config.port}${config.apiPrefix}`);
  console.log(`  health   : http://localhost:${config.port}/health`);
  console.log(`  data dir : ${config.dataDir}\n`);
});

function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down...`);
  server.close(() => process.exit(0));
  // Force-exit if connections linger.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
