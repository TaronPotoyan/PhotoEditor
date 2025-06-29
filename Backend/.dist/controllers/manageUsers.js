"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = GetUser;
exports.CreateUser = CreateUser;
exports.ResetUser = ResetUser;
exports.ResetProcess = ResetProcess;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const keyGenerator_1 = require("../utility/keyGenerator");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function GetUser(req, res) {
    try {
        const { email, password } = req.body;
        console.log('Getting');
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        res.status(200).json({ bool: true, message: "User exists" });
    }
    catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).json({ message: "Server error" });
    }
}
async function CreateUser(req, res) {
    try {
        const { email, password } = req.body;
        console.log('Works');
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new user_1.default({ email, password: hashPassword });
        await newUser.save();
        res.status(201).json({ message: 'User was created' });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
        console.log(`Error: ${e}`);
    }
}
async function ResetUser(req, res) {
    try {
        const { email } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (user.key) {
            res.status(400).json({ message: 'Reset already requested, try again later' });
            return;
        }
        user.key = (0, keyGenerator_1.keyGenerator)();
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS ? process.env.PASS.replace(/\s/g, '') : '',
            },
        });
        const mailOptions = {
            from: `"Password Recovery" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Password Reset Request',
            text: "Plain text fallback",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
                <h2 style="color: #4a6bff;">🔐 Password Reset</h2>
                <p>Hello,</p>
                <p>You requested a password reset. Please click the button below to proceed:</p>
                <a href="http://localhost:5173/forgot-password/${user.key}"
                    style="display: inline-block; padding: 12px 24px; background-color: #4a6bff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,0.1); transition: background 0.3s;">
                    Reset Password
                </a>
                <p style="margin-top: 20px;">This link will expire in <strong>1 minute</strong>.</p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
                <p style="font-size: 13px; color: #888;">
                    Can’t click the button? Copy and paste this link into your browser:<br/>
                    <a href="${process.env.APP}/users/${user.key}" style="color: #4a6bff;">${process.env.APP}/users/${user.key}</a>
                </p>
                </div>
            `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("FULL ERROR:", error);
                return res.status(500).json({ error: error.toString() });
            }
            console.log("Email sent:", info.response);
        });
        setTimeout(async () => {
            user.key = 0;
            await user.save();
        }, 1000 * 10);
        await user.save();
        res.status(200).json({ message: 'Key url is send to your email adress' });
        return;
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(`Error : ${e}`);
    }
}
async function ResetProcess(req, res) {
    try {
        const key = parseInt(req.params.key);
        const { password } = req.body;
        console.log(`Key: `, key);
        if (!key) {
            res.status(401).json({ message: 'this request requires key , password and email' });
            return;
        }
        const user = await user_1.default.findOne({ key });
        if (!user) {
            res.status(401).json({ bool: false, message: `There is not such user as you note` });
            return;
        }
        if (key !== user.key) {
            res.status(401).json({ bool: false, message: 'Invalid Key try later' });
            return;
        }
        user.key = 0;
        const hash = await bcrypt_1.default.hash(password, 10);
        user.password = hash;
        await user.save();
        res.status(200).json({ message: 'Pasword reseted' });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
        console.error(`Error : ${e}`);
    }
    return;
}
