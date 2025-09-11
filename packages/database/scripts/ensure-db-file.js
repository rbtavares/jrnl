#!/usr/bin/env node

import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variable or fallback to default path
if (!process.env.DATABASE_PATH) {
  throw new Error('DATABASE_PATH is not defined');
}

console.log('🔧 Ensuring database file exists...');

// 1. Ensure the database directory exists
const dbDir = dirname(process.env.DATABASE_PATH);
if (!existsSync(dbDir)) {
  console.log(`📁 Creating database directory: ${dbDir}`);
  mkdirSync(dbDir, { recursive: true });
}

// 2. Create database file if it doesn't exist
if (!existsSync(process.env.DATABASE_PATH)) {
  console.log(`📄 Creating database file: ${process.env.DATABASE_PATH}`);
  writeFileSync(process.env.DATABASE_PATH, '');
  console.log('✅ Database file created');
} else {
  console.log('✅ Database file already exists');
}

console.log('✨ Database file preparation complete!');
