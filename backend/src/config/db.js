const mongoose = require("mongoose");
const dns = require("dns");

const env = require("./env");

async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn("MONGO_URI is not set. Database connection skipped.");
    return;
  }

  if (env.dnsServers) {
    const parsedServers = env.dnsServers
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (parsedServers.length > 0) {
      dns.setServers(parsedServers);
    }
  }

  const options = {};
  if (env.mongoDbName) {
    options.dbName = env.mongoDbName;
  }

  await mongoose.connect(env.mongoUri, options);
  console.log("MongoDB connected.");
}

module.exports = {
  connectDatabase,
};
