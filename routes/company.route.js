import express from "express";
import isAuthenticated from "../middelwares/isAuthenticate.js";
import { getcompany, getCompanyById, registerCompany, updateCompnay } from "../controllers/company.controller.js";
import { singleUpload } from "../middelwares/multer.js";

const router  = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getcompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById)
router.route("/update/:id").put(isAuthenticated,singleUpload,updateCompnay);

export default router;
