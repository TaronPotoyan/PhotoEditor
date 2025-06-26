import express from 'express';
import mongoose from 'mongoose';
import route_user from './routers/rout_users';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000 

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



app.use(cors())

app.use(express.json());
app.use('/users', route_user);


app.listen(PORT, () => {
  console.log(`App listens on ${process.env.APP}`);
});
