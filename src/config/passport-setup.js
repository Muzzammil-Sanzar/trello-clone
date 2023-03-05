require("dotenv").config;
const fastifyPassport = require("@fastify/passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const fastifysecuresession = require("@fastify/secure-session");
// const fs = require("fs");
// const path = require("path");

function passportjs(fastify, option, done) {
  const userCollection = fastify.mongo.collection("user");
  console.log(userCollection);
  console.log("passport loaded");
  fastifyPassport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.REACT_APP_CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/redirect",
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
      }
    )
  );
  done();
}

module.exports = passportjs;
