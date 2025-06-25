"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
            validator: function (arr) {
                return arr.every(v => v.startsWith('data:image/png') || v.endsWith('.png'));
            },
            message: () => `One or more images are not valid PNG strings or URLs!`
        }
    },
    key: {
        type: Number,
        required: false,
        default: 0,
        index: true
    }
});
const User = (0, mongoose_1.model)("user", userSchema);
exports.default = User;
