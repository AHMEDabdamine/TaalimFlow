#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing CommonJS imports for Vercel deployment...');

// Step 1: Rename all .js files to .js.cjs in dist-server
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

// Step 2: Fix import statements
function fixImports() {
  const filesToFix = [
    'dist-server/server/index.js.cjs',
    'dist-server/server/routes.js.cjs',
    'dist-server/server/storage.js.cjs'
  ];

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

// Step 3: Create server entry point
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
    console.log('✅ All imports fixed successfully!');
  } else {
    console.log('❌ dist-server directory not found. Run npm run build first.');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error fixing imports:', error);
  process.exit(1);
}