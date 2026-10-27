import express from "express";
import protect from "../config/middleware/auth.middleware.js";
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controller/category.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;