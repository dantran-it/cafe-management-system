const router = require("express").Router();
const orderController = require("../controllers/orderController");
const { authenticate, authorize } = require("../middleware/authen");

router.use(authenticate);

router.post("/", authorize(["customer", "cashier"]), orderController.createOrder);
router.get("/", authorize(["admin", "cashier", "customer", "barista", "deliveryStaff"]), orderController.getOrders);
router.get("/:id", authorize(["admin", "cashier", "customer", "barista", "deliveryStaff"]), orderController.getOrderById);
router.patch("/:id/status", authorize(["admin", "cashier", "barista", "deliveryStaff"]), orderController.updateOrderStatus);

module.exports = router;
