import express from "express";

const app = express(); // create an express app

app.use(express.json()); // middleware to parse JSON request body

// routes import
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import taskRoutes from "./routes/task.route.js";
import categoryRoutes from "./routes/category.route.js";

// routes declaration
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/categories", categoryRoutes);

// example route: http://localhost:4000/api/user/register

export default app;