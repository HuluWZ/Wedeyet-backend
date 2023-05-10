const express = require("express");
// import middlewares
const { validateToken,isSuperAdmin,isAdminORSuperAdmin,isYourAccount } = require("../middlewares/AuthMiddleWare");
// import auth controllers
const {
  createAccount,
  login,
  updateAccount,
  deleteAccount,
  getUser,
  getCurrentUser,
  getAll,
  logOut,
} = require("../controller/Auth.Controller");

const router = express.Router();

// User Account Router
router.post("/register/",validateToken,isSuperAdmin,createAccount);
router.post("/login/", login);
router.put("/update/:id", validateToken,isYourAccount,updateAccount);
router.get("/current/", validateToken, getCurrentUser);
router.get("/get/:id", validateToken, getUser);
router.get("/get/", validateToken,isSuperAdmin,getAll);
router.delete("/delete/:id", validateToken,isYourAccount, deleteAccount);
router.get("/logout", validateToken, logOut);

module.exports = router;
