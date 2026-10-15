import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // basic validation

        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if user already exists
        const existing = await User.findOne({email: email.toLowerCase()});

        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }

        // create new user

        const newUser = new User({
            username: username.toLowerCase(),
            password,
            email: email.toLowerCase(),
        });

         res.status(201).json({ 
            message: "User registered",
             user: {id: user._id, email: user.email, username: user.username}
        });
    }catch (error) {
            res.status(500).json({ message: "Internal server error!", error: error.message });
    }

};

const loginUser = async (req, res) => {
    try{

        //checking if the user already exists
        const {email, password} = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });
        
        if(!user) return res.status(400).json({
            message: "User not found"
        });


         //compare passwords 
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({
            message: "Invalid credentials"

        });

        res.status(200).json({
            message: "User logged in",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });
    }catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const logoutUser = async (req, res) => {
    try{
        const {email} = req.body;

        const user = await User.findOne({
            email
        });

        if(!user) return res.status(404).json({
            message: "User not found"
        });

        res.status(200).json({
            message: "Logged out successfully",
        });
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error", error
        });
    }
}

export {
registerUser,
loginUser,
logoutUser
}