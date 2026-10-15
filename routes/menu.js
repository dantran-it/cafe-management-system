const router = require("express").Router();
const menuController = require("../controllers/menuController");
const { authenticate, authorize } = require("../middleware/authen");

router.use(authenticate);

router.get("/", menuController.getMenuItems);
router.get("/:id", menuController.getMenuItemById);
router.post("/", authorize(["admin", "cashier"]), menuController.createMenuItem);
router.patch("/:id", authorize(["admin", "cashier"]), menuController.updateMenuItem);
router.delete("/:id", authorize(["admin"]), menuController.deleteMenuItem);

module.exports = router;
