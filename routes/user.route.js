import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middelwares/isAuthenticate.js";
import  {singleUpload}  from "../middelwares/multer.js";

const router  = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout)
router.route("/profile/update").post(singleUpload,isAuthenticated,updateProfile);

export default router;
