import { Post } from "../models/post.model.js";

// Create a post
const createPost = async (req, res) => {
    try {
        console.log("Controller reached");

        const { name, description, age } = req.body;

        console.log("Body:", req.body);

        if (!name || !description || !age) {
            return res.status(400).json({ 
                message: "All fields are required"
             });
            }

             console.log("Creating post...");             
        
             const post = await Post.create({ 
                name, 
                description, 
                age 
            });

            console.log("Post created:", post);

            return res.status(201).json({
                message: "Post created successfully", post
             });
                
    } catch (error) {
        console.error("CREATE POST ERROR:", error);

        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message
         });
    }
}

// Read all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        return res.status(200).json({ 
            message: "Posts retrieved successfully", 
            posts: posts 
        });
    } catch (error) {
        console.error("GET POSTS ERROR:", error);

                return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message
         });
    }

}


const updatePost = async (req, res) => {
   try {
     // basic validation to cheeck if the body is empty

     // {name: x, description: y, age: z} -> {name, description, age}
     // {} = truthy
     if (Object.keys(req.body).length === 0) {
         return res.status(400).json({
                message: "No data provided for update"
         });
     }

     const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
       new: true
     });

     if (!post) {
         return res.status(404).json({
             message: "Post not found"
         });
     }

     return res.status(200).json({
         message: "Post Updated Successfully",
         post: post
     });
   } catch (error) {
     console.error("UPDATE POST ERROR:", error);
          return res.status(500).json({ 
       message: "Internal Server Error", 
       error: error.message
    });
   }
}

const deletePost = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
        return res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("DELETE POST ERROR:", error);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message
        });
    }
}
export{
    createPost,
    getPosts,
    updatePost,
    deletePost
}