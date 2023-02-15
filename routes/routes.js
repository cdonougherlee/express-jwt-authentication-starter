const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }), //session false due to using JWT rather than local
  (req, res, next) => {
    res.status(200).json({ success: true, msg: "You're authorized" });
  }
);

// const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// const {
//   setCar,
//   viewCar,
//   updateCar,
//   deleteCar,
// } = require("../controllers/carController");

// Landing and car configurator pages don't need routes
// Logout too will be handled by frontend

// Log in and registration
router.post("/register", registerUser);
router.post("/login", loginUser);

// View and update profile
router
  .route("/:username")
  .get(passport.authenticate("jwt", { session: false }), getProfile)
  .put(passport.authenticate("jwt", { session: false }), updateProfile);

// // Save a user's car from inital car creation screen
// router.post(
//   "/:username/car",
//   passport.authenticate("jwt", { session: false }),
//   setCar
// );

// // View, update and delete a user's car
// router
//   .route("/:username/car/:id")
//   .get(passport.authenticate("jwt", { session: false }), viewCar)
//   .put(passport.authenticate("jwt", { session: false }), updateCar)
//   .delete(passport.authenticate("jwt", { session: false }), deleteCar);

module.exports = router;
