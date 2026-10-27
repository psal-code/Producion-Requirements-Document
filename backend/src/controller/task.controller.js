import { Task } from "../models/task.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

// Create a task
const createTask = async (req, res) => {
    try {
        console.log("Controller reached");

        const { title, description, status, priority, dueDate, categoryId } = req.body;

        console.log("Body:", req.body);

        if (!title || !description || !status || !priority || !dueDate) {
            return res.status(400).json({ 
                message: "All fields are required"
             });
            }

        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            const category = await Category.findOne({ _id: categoryId, userId: req.user._id });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            categoryId: categoryId || null,
            userId: req.user._id
        });

                        console.log("Task created:", task);

            return res.status(201).json({
                message: "Task created successfully", task
             });
                
    } catch (error) {
        console.error("CREATE TASK ERROR:", error);

        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message
         });
    }
}

// Read all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        return res.status(200).json({ 
            message: "Tasks retrieved successfully", 
            tasks: tasks 
        });
    } catch (error) {
        console.error("GET TASKS ERROR:", error);

                return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message
         });
    }

};

// Get a task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task retrieved successfully",
            task
        });
    } catch (error) {
        console.error("GET TASK BY ID ERROR:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const allowed = ["title", "description", "status", "priority", "dueDate", "categoryId"];
        const updates = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => allowed.includes(key))
        );

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid data provided for update"
            });
        }

        if (updates.categoryId) {
            if (!mongoose.Types.ObjectId.isValid(updates.categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            const category = await Category.findOne({ _id: updates.categoryId, userId: req.user._id });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const task = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error("UPDATE TASK ERROR:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error("DELETE TASK ERROR:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const queryTasks = async (req, res) => {
    try {
        // Only allow filtering by these fields
        const allowedFilters = ["status", "priority"];
        const filters = {};

        for (const key of allowedFilters) {
            if (typeof req.query[key] === "string") {
                filters[key] = req.query[key];
            }
        }

        if (typeof req.query.categoryId === "string") {
            if (!mongoose.Types.ObjectId.isValid(req.query.categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            filters.categoryId = req.query.categoryId;
        }

        // Always scope to the logged-in user
        filters.userId = req.user._id;

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([
            Task.find(filters)
                .populate("categoryId", "name color")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Task.countDocuments(filters)
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            message: "Tasks retrieved successfully",
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export{
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    queryTasks
}