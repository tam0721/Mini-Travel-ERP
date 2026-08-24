import express from 'express';
import { login, refreshToken, getProfile, logout, createUser } from '../controllers/auth.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { z } from 'zod';

const router = express.Router();

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid Email"),
        password: z.string().min(1, "Password is required")
    })
});

const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string({ required_error: "Refresh Token is required" })
    })
});

const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid Email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        role: z.enum(['ADMIN', 'SALES', 'OPERATOR']).optional()
    })
});

router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', validate(refreshSchema), refreshToken);
router.get('/profile', requireAuth, getProfile);
router.post('/logout', requireAuth, logout);
router.post('/create-user', requireAuth, requireAdmin, validate(createUserSchema), createUser);

export default router;