const { addMessage, getAllMessage } = require("../controllers/messageControllers");

const router = require("express").Router();

router.post("/addMessage",addMessage);
router.post("/getAllMessages",getAllMessage);

module.exports = router;