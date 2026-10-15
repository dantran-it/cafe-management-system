const router = require("express").Router();
const authenticationController = require("../controllers/authenticationController");

router.post("/login", authenticationController.login);
router.post("/register", authenticationController.register);

module.exports = router;