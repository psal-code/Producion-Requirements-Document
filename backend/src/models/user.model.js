import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
          username: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 1,
        maxlength: 30
     },

       password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50
     },

       email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,  
        
     }

    },

    {
      timestamps: true
    }
)

//before saving any password we need to hash it
userSchema.pre("save", async function() {
   if(!this.isModified("password")) return;
   this.password = await bcrypt.hash(this.password, 10);
});

//compare the passwords
userSchema.methods.comparePassword = async function(password) {
   return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema)
