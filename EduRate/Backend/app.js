import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import userRoutes from './routes/userRoutes.js'
import collegeRoutes from './routes/collegeRoutes.js';
import reviewRoutes from './routes/reviewRoute.js';
import { errorMiddleware } from './middlewares/error.js';

const app = express();


app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/review', reviewRoutes);

app.use(errorMiddleware);

export default app;




