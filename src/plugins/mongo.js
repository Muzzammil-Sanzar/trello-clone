require("dotenv").config;
const fp = require("fastify-plugin");

function dbConnector(fastify, option, done) {
  fastify.register(require("@fastify/mongodb"), {
    forceClose: true,
    url: process.env.dbConnection,
  });
  done();
}

module.exports = fp(dbConnector);
