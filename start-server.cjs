const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Compile the server
console.log('🔨 Compiling server...');
const buildProcess = spawn('npm', ['run', 'build:server'], { stdio: 'inherit' });

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Server compilation failed');
    process.exit(1);
  }
  
  console.log('✅ Server compiled successfully');
  
  // Rename the output to .cjs to work with ES modules
  const serverJsPath = path.join(__dirname, 'dist-server', 'server.js');
  const serverCjsPath = path.join(__dirname, 'dist-server', 'server.cjs');
  
  if (fs.existsSync(serverJsPath)) {
    fs.renameSync(serverJsPath, serverCjsPath);
    console.log('🔄 Renamed server.js to server.cjs');
  }
  
  // Start the server
  console.log('🚀 Starting server...');
  const serverProcess = spawn('node', ['dist-server/server.cjs'], { stdio: 'inherit' });
  
  serverProcess.on('close', (code) => {
    console.log(`❌ Server process exited with code ${code}`);
  });
});