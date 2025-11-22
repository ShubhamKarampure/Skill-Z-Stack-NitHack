// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import {connectDB} from './db/MongoConf.js';
import authRoutes from './routes/AuthRoutes.js';  
import { createWeb3Instance } from './blockchain/provider.js';

dotenv.config();

const app = express();

const corsConfig = {
  origin: ['http://localhost:3000', 'https://your-domain.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],                    
  allowedHeaders: ['Content-Type', 'Authorization'],            
  credentials: true,                                            
};

// Middleware
app.use(cors(corsConfig));               
app.use(express.json());       
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  createWeb3Instance();
  console.log(`Server listening on port ${PORT}`);
});
