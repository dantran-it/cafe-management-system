const MenuItem = require("../models/menuItem");

const createMenuItem = async (req, res) => {
    const { name, category, price, description, available, prepTime, ingredients } = req.body || {};

    if (!name || !category || typeof price !== "number") {
        return res.status(400).json({ message: "name, category and price are required" });
    }

    try {
        const item = await MenuItem.create({
            name: name.trim(),
            category: category.trim(),
            price,
            description: description || "",
            available: available !== false,
            prepTime: prepTime || 10,
            ingredients: Array.isArray(ingredients) ? ingredients : []
        });

        return res.status(201).json(item);
    } catch (error) {
        return res.status(500).json({ message: "Unable to create menu item", error: error.message });
    }
};

const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find().sort({ createdAt: -1 });
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch menu items", error: error.message });
    }
};

const getMenuItemById = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(400).json({ message: "Invalid menu item id" });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!item) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        return res.status(200).json(item);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        return res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Invalid menu item id" });
    }
};

module.exports = {
    createMenuItem,
    getMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem
};
