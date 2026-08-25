import express from 'express';
import { z } from 'zod';
import { requireAdmin, requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import * as bookingController from '../controllers/booking.controller.js';

const router = express.Router();

router.use(requireAuth);

const createSchema = z.object({
    body: z.object({
        customerName: z.string().min(1, "Customer name is required"),
        customerEmail: z.string().email("Invalid Email"),
        customerPhone: z.string().min(8, "Customer phone must be at least 8 characters long"),
        tourName: z.string().min(1, "Tour name is required"),
        travelDate: z.coerce.date({ invalid_type_error: "Invalid Date, expected a valid date string" }),
        totalPrice: z.number().positive("Price must be greater than 0")
    })
});

const statusSchema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
        note: z.string().optional()
    })
});

const updateSchema = z.object({
    body: z.object({
        customerName: z.string().min(1, "Customer name is required").optional(),
        customerEmail: z.string().email("Invalid Email").optional(),
        customerPhone: z.string().min(8, "Customer phone must be at least 8 characters long").optional(),
        tourName: z.string().min(1, "Tour name is required").optional(),
        travelDate: z.coerce.date({ invalid_type_error: "Invalid Date, expected a valid date string" }).optional(),
        totalPrice: z.number().positive("Price must be greater than 0").optional(),
        notes: z.string().optional()
    }).refine(data => Object.keys(data).length > 0, { message: 'At least one field is required' })
});

router.post('/', validate(createSchema), bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingDetail);
router.patch('/:id', validate(updateSchema), bookingController.updateBooking);
router.patch('/:id/status', requireAdmin, validate(statusSchema), bookingController.updateBookingStatus);
router.delete('/:id', requireAdmin, bookingController.deleteBooking);

export default router;