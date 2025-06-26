import User from "../models/user";
import type { Request , Response } from "express";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { keyGenerator } from "../utility/keyGenerator";
import dotenv from 'dotenv';
dotenv.config();


export async function GetUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    console.log('Getting');
    
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    res.status(200).json({bool : true ,  message: "User exists" });
  } catch (e) {
    console.error(`Error: ${e}`);
    res.status(500).json({ message: "Server error" });
  }
}


export async function CreateUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    
    console.log('Works');
    console.log(email,password);
    
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashPassword });

    await newUser.save();

    res.status(201).json({ message: 'User was created' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
    console.log(`Error: ${e}`);
  }
}




export async function  ResetUser(req : Request , res : Response) : Promise<void> {
        try {
            const {
                email
            } = req.body;
            const user = await User.findOne({email});
            if (!user) {
                res.status(404).json({message : 'User not found'});
                return;
            }

            if (user.key) {
                res.status(400).json({message : 'Reset already requested, try again later'})
                return;
            }

            user.key = keyGenerator();

            const transporter = nodemailer.createTransport({
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
                <a href="${process.env.FRONT}/${user.key}"
                    style="display: inline-block; padding: 12px 24px; background-color: #4a6bff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,0.1); transition: background 0.3s;">
                    Reset Password
                </a>
                <p style="margin-top: 20px;">This link will expire in <strong>1 minute</strong>.</p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
                <p style="font-size: 13px; color: #888;">
                    Can’t click the button? Copy and paste this link into your browser:<br/>
                    <a href="${process.env.APP}/users/forgot-password/${user.key}" style="color: #4a6bff;">${process.env.APP}/users/${user.key}</a>
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

            setTimeout (async () => {
                user.key = 0;
                await user.save()
            }, 1000 * 100);
            
            await user.save();
            res.status(200).json({message : 'Key url is send to your email adress'});
            return
        } catch (e) {
            res.status(500).json({message : 'Internal Server Error'});
            console.log(`Error : ${e}`);
        }
}


export async function ResetProcess(req : Request , res : Response) : Promise<void> {
    try {

        const key = parseInt (req.params.key );
        const {password} = req.body;
        console.log(`Key: ` , key);
        if (!key ) {
            res.status(401).json({message : 'this request requires key , password and email'});
            return;
        }
        const user = await User.findOne({key});
        console.log(user);
        

        if (!user) {

            res.status(401).json({ bool : false , message : `There is not such user as you note`});
            return;
        }

        if (key !== user.key) {
            res.status(401).json({ bool : false , message : 'Invalid Key try later'});
            return;
        }

        user.key = 0;
        const hash = await  bcrypt.hash(password,10);
        user.password = hash;
        await user.save();
        res.status(200).json({message : 'Pasword reseted'});

    }catch(e) {
        res.status(500).json({message : 'Server error'});
        console.error(`Error : ${e}`);
    }
    return;
}