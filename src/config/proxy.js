// config/proxy.js
require('dotenv').config();

const proxyConfig = () => {
  const username = process.env.BRIGHT_DATA_USERNAME;
  const password = process.env.BRIGHT_DATA_PASSWORD;
  const port = 22225;
  const session_id = Math.floor(100000 * Math.random()); // Generate a session ID

  return {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };
};

module.exports = proxyConfig;
