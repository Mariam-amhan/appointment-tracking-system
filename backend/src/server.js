const http = require("http");
const app = require("./app");
const env = require("./config/env");
const { connectDatabase } = require("./config/db");
async function startServer() {
  try {
    await connectDatabase();
    const server = http.createServer(app);
    server.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}
startServer();
