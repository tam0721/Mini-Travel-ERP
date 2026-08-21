import express from "express";

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: "Server is healthy and running!",
        timestamp: new Date().toISOString()
    });
});

export default app;