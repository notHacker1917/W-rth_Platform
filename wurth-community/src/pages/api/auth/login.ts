import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';

// CORS middleware
function setCorsHeaders(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Initialize database with seed data
function initializeDatabase() {
  try {
    // Create table if it doesn't exist
    db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student' NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as INTEGER))
      )
    `);

    // Seed initial users if table is empty
    const existingUsers = db.select().from(users).all();
    if (existingUsers.length === 0) {
      // Use raw SQL to insert initial users
      db.run(sql`
        INSERT INTO users (email, password, role) VALUES
        ('admin@example.com', 'AdminPass123', 'sys_admin'),
        ('employee@wuerth.com', 'WürthSecurePass1', 'wurth_employee'),
        ('student@university.edu', 'StudentPass123', 'student')
      `);
      console.log('✅ Database seeded with initial users');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Initialize database on first call
    initializeDatabase();

    // FIX 1: Safely handle the body whether Next.js pre-parsed it or not
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // FIX 2: Trim invisible spaces just in case!
    const email = body.email?.trim();
    const password = body.password?.trim();

    console.log("--- LOGIN ATTEMPT ---");
    console.log("1. Incoming Email:", `"${email}"`);
    console.log("2. Incoming Password:", `"${password}"`);

    const user = db.select().from(users).where(eq(users.email, email)).get();

    console.log("3. Database found:", user);
    console.log("---------------------");

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({ 
      role: user.role,
      email: user.email,
      id: user.id 
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: 'Internal Server Error', error: String(error) });
  }
}