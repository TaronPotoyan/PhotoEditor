import express from 'express';
import mongoose from 'mongoose';
import route_user from './routers/rout_users';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();

async function Start(): Promise<void> {
  try {
        await mongoose.connect('mongodb://localhost:27017/Picture_editor');
        console.log('✅ DB connected');
        
    } catch (e) {
        console.error('❌ Can’t access DB');
        throw new Error('Can not access to DB');
    }
}

Start();
app.use(cors())
app.use(express.json());
app.use('/users',route_user);


app.listen(process.env.PORT , () => {
    console.log(`App listens on ${process.env.APP}`);    
});