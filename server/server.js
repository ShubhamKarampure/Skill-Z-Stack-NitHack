// server.js
import express from 'express'
import cors from 'cors'

const app = express();

const corsConfig = {
  origin: ['http://localhost:3000', 'https://your-domain.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],                    
  allowedHeaders: ['Content-Type', 'Authorization'],            
  credentials: true,                                            
};

// Middleware
app.use(cors());               
app.use(express.json());       

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
