const Inventory = require("../models/inventory");

const createInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.create(req.body);
        return res.status(201).json(item);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getInventory = async (req, res) => {
    try {
        const items = await Inventory.find().sort({ itemName: 1 });
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch inventory", error: error.message });
    }
};

const updateInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!item) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        return res.status(200).json(item);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const deleteInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        return res.status(200).json({ message: "Inventory item deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Invalid inventory item id" });
    }
};

module.exports = {
    createInventoryItem,
    getInventory,
    updateInventoryItem,
    deleteInventoryItem
};
