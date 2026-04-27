const express = require("express");
const router = express.Router();
const getAllTask=require("../controllers/user/getAllTask");
const { getAccessToUser} = require("../middlewares/userMiddleware");
const updateTaskStatus=require("../controllers/user/updateTask");


router.get("/getalltask", getAccessToUser, getAllTask);
router.put("/updatetask/:id", getAccessToUser, updateTaskStatus);

module.exports = router;