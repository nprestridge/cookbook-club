#!/usr/bin/env node

// Fast test runner script for Playwright
// Usage: node scripts/test-fast.js [test-pattern]

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get test pattern from command line args
const testPattern = process.argv.slice(2).join(' ') || '';

// Build Playwright command with optimizations
const playwrightArgs = [
  'test',
  '--project=chromium', // Only run Chrome for speed
  '--workers=4', // Max parallel workers
  '--reporter=line', // Minimal reporter for speed
];

// Add test pattern if provided
if (testPattern) {
  playwrightArgs.push(...testPattern.split(' '));
}

console.log(`🚀 Running fast Playwright tests...`);
if (testPattern) {
  console.log(`📝 Test pattern: ${testPattern}`);
}
console.log('');

// Run Playwright with optimized settings
const playwright = spawn('npx', ['playwright', ...playwrightArgs], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
});

playwright.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Fast tests completed successfully!');
  } else {
    console.log(`\n❌ Fast tests failed with code ${code}`);
  }
  process.exit(code);
});
