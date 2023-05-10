const { User } = require("../models/User");

const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  PHONE_NOT_FOUND_ERR,
  PHONE_ALREADY_EXISTS_ERR,
  USER_NOT_FOUND_ERR,
  INCORRECT_OTP_ERR,
  EMAIL_ALREADY_EXISTS_ERR,
} = require("../config/errors");
const { compareSync } = require("bcrypt");

exports.createAccount = async (req, res, next) => {
  try {
    let userData = req.body;
    const { email, password,phoneNumber, ...other } = userData;

    const phoneORemailExist = await User.findOne({
      $or: [{ phoneNumber }, { email }],
    });
    
    // userData.role = "ADMIN";

    if (phoneORemailExist) {
      return res
        .status(400)
        .send({ message: "Phone Number or Email  already exist!" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    userData.password = encryptedPassword;
    // console.log(userData);
    const newUser = await User.create(userData);
    const token = jwt.sign(
    { user_id: newUser._id, email },
    process.env.JWT_TOKEN_SECRET_KEY,
    {
      expiresIn: "1d",
        }
    );
    newUser.token = token;
    res
      .status(201)
      .send({
        user: newUser,
        message: "Account Created Saved Succesfully !",
      });

    await newUser.save();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, email, password } = req.body;
    const query = [{ email: email }, { phoneNumber: phoneNumber }];
    const user = await User.findOne({ $or: query });
    if (!user) {
      res.status(404).json({ message: "User Doestn't Exist. Try Sign Up!" });
      return;
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_TOKEN_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      user.token = token;
      // verify User
      const updatedUser = await User.findOneAndUpdate(
        { $or: [{ email }, { phoneNumber }] },
        { is_verified: true, token: token },
        { new: true }
      );
      return res.status(200).json({ User: user });
    }
    res.status(400).send("Invalid Credentials");
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId },{password:0});

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send({ User: user });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    var newUserInfo = req.body;
    const userID = req.params.id;
    
    if (newUserInfo.password) { 
      const encryptedPassword = await bcrypt.hash(newUserInfo.password, 10);
      newUserInfo.password = encryptedPassword;
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userID },
      newUserInfo,
      { new: true }
    );
    return res
      .status(202)
      .send({ updatedUser, message: "Profile Updated Succesfully !" });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .send({ message: "Your Account has been Deleted Succesfully !" });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const deactivatedUser = await User.findOne({ _id: req.params.id });
    return res.status(202).send({
      User:deactivatedUser? deactivatedUser: "User Not Found",
      message: " Success !",
    });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};
exports.getAll = async (req, res) => {
  try {
    const getAll = await User.find({ role: "ADMIN"});
    return res
      .status(202)
      .send({
        TotalUsers:getAll.length,
        Users: getAll,
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};

exports.logOut = async (req, res) => {
  try {
    req.user = null;
    return res.status(202).send({ message: "Logged Out Successfully.",Token:null });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};
