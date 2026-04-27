const express = require("express");
const router = express.Router();
const getAllTask=require("../controllers/admin/getAllTask");
const createTask = require("../controllers/admin/createTask");
const { getAccessToAdmin } = require("../middlewares/adminMiddleware");
const getAlluser=require("../controllers/admin/getAlluser")


router.post("/createtask", getAccessToAdmin, createTask);
router.get("/getalltask", getAccessToAdmin, getAllTask);
router.get("/getalluser", getAccessToAdmin, getAlluser);

module.exports = router;