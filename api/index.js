const serverless = require('serverless-http');
const app = require('../app'); // import ứng dụng Express

module.exports = serverless(app);
