import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  images: {
        type: [String],
        default: [],
        validate: {
        validator: function(arr: string[]) {
            return arr.every(v => v.startsWith('data:image/png') || v.endsWith('.png'));
        },
        message: () => `One or more images are not valid PNG strings or URLs!`
        }
  },
  key : {
    type : Number,
    required: false,
    default : 0,
    index : true
  }
});

const User = model("user", userSchema);

export default User;
