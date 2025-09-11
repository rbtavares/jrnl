#!/usr/bin/env node

import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { dirname } from 'path';

// Hardcoded database path
const DATABASE_PATH = './data/database.sqlite';

console.log('🔧 Ensuring database file exists...');

// 1. Ensure the database directory exists
const dbDir = dirname(DATABASE_PATH);
if (!existsSync(dbDir)) {
  console.log(`📁 Creating database directory: ${dbDir}`);
  mkdirSync(dbDir, { recursive: true });
}

// 2. Create database file if it doesn't exist
if (!existsSync(DATABASE_PATH)) {
  console.log(`📄 Creating database file: ${DATABASE_PATH}`);
  writeFileSync(DATABASE_PATH, '');
  console.log('✅ Database file created');
} else {
  console.log('✅ Database file already exists');
}

console.log('✨ Database file preparation complete!');
