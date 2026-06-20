import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'wurth_community.db');

// 🚨 ADD THIS LINE to see exactly where Next.js is looking
console.log("🚀 SERVER BOOTING - DATABASE PATH IS:", dbPath);

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });