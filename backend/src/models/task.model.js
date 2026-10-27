import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
        {
     title: {
        type: String,
        required: true,
        trim: true,
        max: 100
        },
    
        description: {
            type: String,
            required: true,
            trim: true  
        },

        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },

        dueDate: {
           type: Date, 
        },
 
         userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
         },

         categoryId: {
            type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  default: null, // a task doesn't have to have a category
         }
      
    },

    {
        timestamps: true
    }
)

//before saving any password we need to hash it
taskSchema.pre("save", async function() {
   if(!this.isModified("password")) return;
   this.password = await bcrypt.hash(this.password, 10);
});

//compare the passwords
taskSchema.methods.comparePassword = async function(password) {
   return await bcrypt.compare(password, this.password);
}

// Faster lookups of a user's tasks
taskSchema.index({ userId: 1 });

export const Task = mongoose.model("Task", taskSchema)