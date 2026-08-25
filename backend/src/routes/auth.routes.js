import express from 'express';
import { login, refreshToken, getProfile, logout, createUser } from '../controllers/auth.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per `window` (here, per 15 minutes)
    message: { status: 'error', message: 'Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút' }
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid Email"),
        password: z.string().min(1, "Password is required")
    })
});

// refreshSchema removed as refreshToken is now in cookies

const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid Email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        role: z.enum(['ADMIN', 'SALES', 'OPERATOR']).optional()
    })
});

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.get('/profile', requireAuth, getProfile);
router.post('/logout', requireAuth, logout);
router.post('/create-user', requireAuth, requireAdmin, validate(createUserSchema), createUser);

export default router;