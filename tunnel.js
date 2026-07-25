import localtunnel from 'localtunnel';

(async () => {
  try {
    console.log("Starting localtunnel on port 5000 with fixed subdomain...");
    const tunnel = await localtunnel({ port: 5000, subdomain: 'form2login-student-register' });
    console.log("\n==========================================");
    console.log("SUCCESS! YOUR LIVE TUNNEL URL IS:");
    console.log(tunnel.url);
    console.log("\nFULL GOOGLE APPS SCRIPT WEBHOOK URL:");
    console.log(`${tunnel.url}/api/students/google-register`);
    console.log("==========================================\n");

    tunnel.on('close', () => {
      console.log('Tunnel connection closed.');
    });
  } catch (err) {
    console.error("Tunnel creation failed:", err);
  }
})();
