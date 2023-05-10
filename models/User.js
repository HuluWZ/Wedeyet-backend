const mongoose = require("mongoose");
const { USER_TYPES,PAYMENT_METHODS } = require("../config/utils");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last Name is required"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      minlength: 9,
      maxlength: 13,
      unique: [true, "Phone Number is Unique"],
      required: [true, "Phone Number is required"],
    },
    email: {
      type: String,
      unique: [true, "Email is Unique"],
      required: [true, "Email is Required"],
    },
    password: {
      type: String,
      trim: true,
      minlength:8,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: USER_TYPES,
      default:"ADMIN"
      // required:[true, "Role is required"]
    },
    token: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);


const User =  mongoose.model("User", UserSchema, "User");
module.exports = {User}
