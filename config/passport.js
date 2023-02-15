const fs = require("fs");
const path = require("path");
const User = require("mongoose").model("User");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Get and encode public key
const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

// Options for the jwt strategy
// JwtStrategy expects certain syntax of the JWT, which ExtractJwt function provides
// Authorization: Bearer <token>
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

// Validate JWT, pass on the payload once done
const strategy = new JwtStrategy(options, (payload, done) => {
  // JWT payload has a sub field, includes some info/unique identifier about the user.
  // When the routes are created, the mongodb _id goes in the sub field
  User.findOne({ _id: payload.sub })
    // Because the JWT strategy has already run, know there is a valid JWT here and dont need to check
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
