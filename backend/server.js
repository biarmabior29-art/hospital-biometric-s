import express from 'express'
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config   from './config/db.js'; 

// Import Routes
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import appointmentRoutes from './routes/appointments.js';
import biometricRoutes from './routes/biometric.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Connect to MongoDB
config(); // call the connection function

// Middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Socket.io for real-time biometric verification
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('biometric-scan', (data) => {
    // Simulate biometric verification
    setTimeout(() => {
      socket.emit('biometric-result', {
        success: true,
        message: 'Biometric verification successful',
        patientId: data.patientId
      });
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/biometric', biometricRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Healthcare Management System API');
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

export { app, io };
