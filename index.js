const fastify = require("fastify")({ logger: true });
fastify.register(require("./src/config/passport-setup"));
fastify.register(require("./src/plugins/mongo"));
fastify.register(require("./src/plugins/jwt"));
fastify.register(require("./src/plugins/routes"));

require("dotenv").config();

const fastifyPassport = require("@fastify/passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const fastifysecuresession = require("@fastify/secure-session");
const fs = require("fs");
const path = require("path");

fastify.register(fastifysecuresession, {
  key: fs.readFileSync(path.join(__dirname, "not-so-secret-key")),
  cookie: {
    path: "/",
  },
});

fastify.register(fastifyPassport.initialize());
fastify.register(fastifyPassport.secureSession());

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

fastify.get("/", async (req, res) => {
  return `👋 Hello world 👋`;
});

const start = async () => {
  await fastify.register(require("@fastify/express"));
  fastify
    .listen({ port: 5000 })
    .then((address) => console.log("Server listening to port: ", address))
    .catch((err) => {
      console.log("Error Starting server: ", err);
      fastify.log.error(err);
    });
};

start();
