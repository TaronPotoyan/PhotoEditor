import express from 'express';
import mongoose from 'mongoose';
import route_user from './routers/rout_users';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();


async function Start(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Picture_editor');
    console.log('✅ DB connected');
  } catch (e) {
    console.error('❌ Can’t access DB');
    console.log(e);
    
    throw new Error('Can not access to DB');
  }
}

Start();

app.use(cors({
  origin: 'https://photo-editor-blue.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.options('*', cors());


app.use(express.json());
app.use('/users', route_user);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`App listens on ${process.env.APP}`);
});
