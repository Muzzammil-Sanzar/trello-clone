require("dotenv").config();
function loadenv(key) {
  const envVar = process.env[key];
  if (!envVar) {
    throw new Error(`Configuration must include ${key}`);
  }
  return envVar;
}

module.exports = {
  secretKey: loadenv("SECRET_KEY"),
};
