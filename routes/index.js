const express = require("express");
const router = express.Router();
const authenRouter = require("./authen");
const menuRouter = require("./menu");
const orderRouter = require("./order");
const inventoryRouter = require("./inventory");

router.use("/authen", authenRouter);
router.use("/menu", menuRouter);
router.use("/orders", orderRouter);
router.use("/inventory", inventoryRouter);

module.exports = router;