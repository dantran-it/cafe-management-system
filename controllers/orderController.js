const mongoose = require("mongoose");
const Order = require("../models/order");
const MenuItem = require("../models/menuItem");

const createOrder = async (req, res) => {
    const { items, deliveryAddress, paymentMethod, paymentStatus } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "At least one order item is required" });
    }

    try {
        const preparedItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
            }

            const quantity = Number(item.quantity || 1);
            const priceAtOrder = menuItem.price;
            totalAmount += quantity * priceAtOrder;

            preparedItems.push({
                menuItem: menuItem._id,
                quantity,
                priceAtOrder,
                notes: item.notes || ""
            });
        }

        const order = await Order.create({
            customer: req.user.userId,
            items: preparedItems,
            totalAmount,
            deliveryAddress: deliveryAddress || "",
            paymentMethod: paymentMethod || "cash",
            paymentStatus: paymentStatus || "pending",
            status: "pending"
        });

        await order.populate("customer", "username fullName role");
        await order.populate("items.menuItem");

        return res.status(201).json(order);
    } catch (error) {
        return res.status(500).json({ message: "Unable to create order", error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const query = req.user.role === "customer" ? { customer: req.user.userId } : {};
        const orders = await Order.find(query)
            .populate("customer", "username fullName role")
            .populate("items.menuItem")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch orders", error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const query = req.user.role === "customer"
            ? { _id: req.params.id, customer: req.user.userId }
            : { _id: req.params.id };

        const order = await Order.findOne(query)
            .populate("customer", "username fullName role")
            .populate("items.menuItem");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(400).json({ message: "Invalid order id" });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status, assignedTo } = req.body || {};

    if (!status) {
        return res.status(400).json({ message: "status is required" });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        if (assignedTo) { order.assignedTo = assignedTo; }

        await order.save();
        await order.populate("customer", "username fullName role");
        await order.populate("items.menuItem");

        return res.status(200).json(order);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
};
