export const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    const status = err.statusCode || 500;
    const message = err.message ? err.message.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : "Internal Server Error";

    res.status(status).json({
        status: 'error',
        message: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};