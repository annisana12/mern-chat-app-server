import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    name: {
        type: String,
        required: false
    },
    profileImage: {
        type: String,
        required: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    }
})

userSchema.pre("save", async function() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
})

const User = mongoose.model("Users", userSchema);

export default User;