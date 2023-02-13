const fs = require("fs");
const path = require("path");
const User = require("mongoose").model("User");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
// const SECRET = process.env.SECRET
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

// This runs a validation on the JWT, and passes on the payload once its done
const strategy = new JwtStrategy(options, (payload, done) => {
  // JWT payload has a sub field, includes some info/unique identifier about the user.
  // When we create the register/login functions (routes), we put the mongodb _id in the sub field
  // Because the JWT strategy has already run, we know there is a valid JWT here and dont need to check
  User.findOne({ _id: payload.sub })
    .then((user) => {
      // Passport expects to see ethier a user or false
      // Put ADMIN stuff here for later
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null)); // null = no user
});

module.exports = (passport) => {
  passport.use(strategy);
};
