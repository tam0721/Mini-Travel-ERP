import express from "express";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: "Server is healthy and running!",
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;