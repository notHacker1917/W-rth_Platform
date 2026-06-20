import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { db } from './index.ts'; // Import your Drizzle db instance

// 1. Schema Definition
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['sys_admin', 'wurth_employee', 'student'] }).default('student').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// 2. Seeding Logic
export async function seedInitialUsers() {
  // Ensure the table exists (Drizzle also handles this via push/migrations, 
  // but running this raw SQL maintains compatibility with your snippet)
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'student' NOT NULL,
      created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed the initial users with plain text passwords
  await db.run(sql`
    INSERT OR IGNORE INTO users (email, password, role) 
    VALUES 
      ('admin@example.com', 'AdminPass123', 'admin'),
      ('employee@wuerth.com', 'WürthSecurePass1', 'wurth_employee'),
      ('student@university.edu', 'StudentPass123', 'student');
  `);
}