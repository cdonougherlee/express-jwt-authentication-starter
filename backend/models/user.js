const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    hash: {
      type: String,
      required: [true, "Please add a hash"],
    },
    salt: {
      type: String,
      required: [true, "Please add a salt"],
    },
    prefDealer: {
      type: String,
      required: [true, "Please select a dealership"],
    },
    cars: [
      {
        type: Schema.Types.ObjectId,
        ref: "Car",
      },
    ],
  },
  {
    timestamps: true,
  }
);

mongoose.model("User", UserSchema);
