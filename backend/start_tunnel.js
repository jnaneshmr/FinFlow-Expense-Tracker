const { spawn } = require('child_process');

function startTunnel() {
  console.log('Starting localtunnel...');
  const tunnel = spawn('npx.cmd', ['localtunnel', '--port', '5000', '--subdomain', 'jnanesh-finflow-backend'], { stdio: 'inherit' });

  tunnel.on('close', (code) => {
    console.log(`localtunnel exited with code ${code}. Restarting in 2 seconds...`);
    setTimeout(startTunnel, 2000);
  });
}

startTunnel();
