const serverless = require("serverless-http");
const app = require("../../index"); //load index.js
module.exports.handler = serverless(app.app);
