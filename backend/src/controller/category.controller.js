import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import { Task } from "../models/task.model.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a category
const createCategory = async (req, res) => {
    try {
        const { name, color } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const category = await Category.create({
            name,
            color,
            userId: req.user._id
        });

        return res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error("CREATE CATEGORY ERROR:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Get all categories of the logged-in user
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user._id }).sort({ name: 1 });

        return res.status(200).json({
            message: "Categories retrieved successfully",
            count: categories.length,
            categories
        });
    } catch (error) {
        console.error("GET CATEGORIES ERROR:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const updates = {};
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.color !== undefined) updates.color = req.body.color;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No data provided for update" });
        }

        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            updates,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error("UPDATE CATEGORY ERROR:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Delete a category (its tasks stay, but lose the category)
const deleteCategory = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const deleted = await Category.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }

        await Task.updateMany(
            { categoryId: deleted._id, userId: req.user._id },
            { categoryId: null }
        );

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("DELETE CATEGORY ERROR:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};