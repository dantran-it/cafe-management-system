const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");
const { authenticate, authorize } = require("../middleware/authen");

router.use(authenticate);

router.get("/", authorize(["admin", "cashier", "barista"]), inventoryController.getInventory);
router.post("/", authorize(["admin"]), inventoryController.createInventoryItem);
router.patch("/:id", authorize(["admin", "cashier"]), inventoryController.updateInventoryItem);
router.delete("/:id", authorize(["admin"]), inventoryController.deleteInventoryItem);

module.exports = router;
