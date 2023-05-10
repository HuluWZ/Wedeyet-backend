const express = require("express");
// import middlewares
const { validateToken, isSuperAdmin, isAdminORSuperAdmin,isYourAccount } = require("../middlewares/AuthMiddleWare");

// import auth controllers
const {
  createService,
  getService,
  getAllServices,
  updateService,
  deleteService,
  insertAllServices
} = require("../controller/Service.Controller");

const router = express.Router();

// User Account Router
router.post("/create/",validateToken,isAdminORSuperAdmin,createService );
router.put("/update/:id", validateToken,isAdminORSuperAdmin, updateService);-
router.get("/get/:id",validateToken,isAdminORSuperAdmin,getService);
router.get("/all/", validateToken,isAdminORSuperAdmin,getAllServices);
router.delete("/delete/:id", validateToken, isAdminORSuperAdmin,deleteService);
router.post("/test/", validateToken, isAdminORSuperAdmin, insertAllServices);
module.exports = router;
