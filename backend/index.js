import express from 'express';
import cors from 'cors';
import userRouter from './routes/routes.js';
import db from './database/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
const app = express();
const PORT = process.env.PORT || 4000;
import multer from 'multer';
const upload = multer();
// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Other middleware and route setup
app.use(express.json());
app.use(cookieParser())  
app.use('/api', userRouter);
app.use('/uploads', express.static('public/uploads'));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
