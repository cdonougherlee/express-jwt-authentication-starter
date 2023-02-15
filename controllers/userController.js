const mongoose = require("mongoose");
const { authorize } = require("passport");
const router = require("express").Router();
const User = mongoose.model("User");
const auth = require("../middleware/authMiddleware");

const registerUser = (req, res, next) => {
  // Create salt and hash based off the plain text pw
  const saltHash = auth.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
    prefDealer: req.body.prefDealer,
  });

  try {
    newUser.save().then((user) => {
      const jwt = auth.genJWT(user);

      res.json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    });
  } catch (err) {
    res.json({ success: false, msg: err });
  }
};

const loginUser = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "could not find user" });
      }

      // Function defined at bottom of app.js
      const isValid = auth.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      // Issue jwt if password valid
      if (isValid) {
        const tokenObject = auth.genJWT(user);

        res.status(200).json({
          success: true,
          user: user,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const getProfile = (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
};

const updateProfile = (req, res, next) => {
  return res.status(200).json({ success: true, msg: "Update user" });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
