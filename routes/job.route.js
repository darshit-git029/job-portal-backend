import express from "express";
import isAuthenticated from "../middelwares/isAuthenticate.js";
import { getAllJob, getJobAdmin, getJobById, postJob } from "../controllers/job.controller.js";

const router  = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated,getAllJob);
router.route("/getById/:id").get(isAuthenticated,getJobById)
router.route("/getjobadmin").get(isAuthenticated,getJobAdmin);

export default router;
