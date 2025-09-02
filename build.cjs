#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting TaalimFlow build process...');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
if (fs.existsSync('dist-server')) {
  fs.rmSync('dist-server', { recursive: true, force: true });
}

// Step 2: Build frontend
console.log('🔨 Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Step 3: Build server
console.log('🔧 Building server...');
execSync('tsc -p tsconfig.server.json', { stdio: 'inherit' });

// Step 4: Fix CommonJS imports
console.log('🔧 Fixing CommonJS imports...');

// Rename all .js files to .js.cjs in dist-server
function renameJsFiles(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      renameJsFiles(fullPath);
    } else if (item.endsWith('.js') && !item.endsWith('.cjs')) {
      const newPath = fullPath + '.cjs';
      fs.renameSync(fullPath, newPath);
      console.log(`  ✓ Renamed ${fullPath} to ${newPath}`);
    }
  }
}

// Fix import statements
function fixImports() {
  const fixes = [
    // Fix route import in index
    {
      file: 'dist-server/server/index.js.cjs',
      search: /require\("\.\/routes"\)/g,
      replace: 'require("./routes.js.cjs")'
    },
    // Fix storage and telegram imports in routes
    {
      file: 'dist-server/server/routes.js.cjs',
      search: /require\("\.\/storage"\)/g,
      replace: 'require("./storage.js.cjs")'
    },
    {
      file: 'dist-server/server/routes.js.cjs',
      search: /require\("\.\/telegram"\)/g,
      replace: 'require("./telegram.js.cjs")'
    },
    // Fix schema imports
    {
      file: 'dist-server/server/routes.js.cjs',
      search: /require\("\.\.\/shared\/schema"\)/g,
      replace: 'require("../shared/schema.js.cjs")'
    },
    {
      file: 'dist-server/server/storage.js.cjs',
      search: /require\("\.\.\/shared\/schema"\)/g,
      replace: 'require("../shared/schema.js.cjs")'
    }
  ];

  for (const fix of fixes) {
    if (fs.existsSync(fix.file)) {
      let content = fs.readFileSync(fix.file, 'utf8');
      content = content.replace(fix.search, fix.replace);
      fs.writeFileSync(fix.file, content);
      console.log(`  ✓ Fixed imports in ${fix.file}`);
    }
  }
}

// Create server entry point
function createServerEntry() {
  const entryContent = `// Entry point for the compiled server
require('./server/index.js.cjs');`;
  
  fs.writeFileSync('dist-server/server.cjs', entryContent);
  console.log('  ✓ Created dist-server/server.cjs entry point');
}

// Run the fixes
try {
  if (fs.existsSync('dist-server')) {
    renameJsFiles('dist-server');
    fixImports();
    createServerEntry();
    console.log('✅ Server build completed successfully!');
  } else {
    console.log('❌ dist-server directory not found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error during build:', error);
  process.exit(1);
}

console.log('🎉 Build process completed successfully!');
console.log('📦 Frontend built to: dist/');
console.log('🚀 Server built to: dist-server/');
console.log('▶️  Start with: npm run start');