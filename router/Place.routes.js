const express = require("express");
// import middlewares
const { validateToken, isSuperAdmin, isAdminORSuperAdmin,isYourAccount } = require("../middlewares/AuthMiddleWare");
const { cloudUploadTry,uploadProductImage,uploadAnyProductImage } = require("../middlewares/FileUploadMiddleWare");

// import auth controllers
const {
  createPlace,
  getAllPlaces,
  getPlace,
  searchPlace,
  updatePlace,
  approvePlace,
  deletePlace,
  uploadImage
} = require("../controller/Place.controller");

const router = express.Router();

// User Account Router
router.post("/create/",validateToken,isAdminORSuperAdmin,uploadProductImage,createPlace );
router.get("/search",searchPlace);
router.put("/update/:id", validateToken,isAdminORSuperAdmin,uploadAnyProductImage,updatePlace);
router.put("/approve/:id", validateToken,isAdminORSuperAdmin,approvePlace);
// router.get("/current/", validateToken, getCurrentUser)
router.put("/upload/:id",uploadProductImage,uploadImage)
router.get("/get/:id",validateToken, getPlace);
router.get("/all/", validateToken,isSuperAdmin,getAllPlaces);
router.delete("/delete/:id", validateToken, deletePlace);

module.exports = router;
