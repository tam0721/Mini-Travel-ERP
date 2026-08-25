import * as bookingService from "../services/booking.service.js";
import dayjs from "dayjs";

export const createBooking = async (req, res, next) => {
    try {
        const creatorId = req.user.userId;
        const booking = await bookingService.createBooking(req.body, creatorId);

        const formattedBooking = {
            ...booking,
            bookingDate: dayjs(booking.bookingDate).format('YYYY-MM-DD HH:mm:ss'),
            travelDate: dayjs(booking.travelDate).format('YYYY-MM-DD')
        }

        res.status(201).json({ status: 'success', data: formattedBooking });
    } catch (error) {
        next(error);
    }
};

export const getAllBookings = async (req, res, next) => {
    try {
        const { status, keyword, page, limit, sort } = req.query;
        const results = await bookingService.getAllBookings({ status, keyword, page, limit, sort });

        const formattedBookings = results.data.map((booking) => {
            return {
                ...booking,
                bookingDate: dayjs(booking.bookingDate).format('YYYY-MM-DD HH:mm:ss'),
                travelDate: dayjs(booking.travelDate).format('YYYY-MM-DD')
            }
        });

        res.status(200).json({
            status: 'success',
            data: formattedBookings,
            pagination: results.pagination
        });
    } catch (error) {
        next(error);
    }
};

export const getBookingDetail = async (req, res, next) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);

        const { user: creator, createdAt, updatedAt, ...bookingRest } = booking;

        const formattedBooking = {
            ...bookingRest,
            createdBy: creator,
            bookingDate: dayjs(booking.bookingDate).format('YYYY-MM-DD HH:mm:ss'),
            travelDate: dayjs(booking.travelDate).format('YYYY-MM-DD'),
            statusLogs: bookingRest.statusLogs.map((log) => {
                const { user: confirmer, ...logRest } = log;

                return {
                    ...logRest,
                    changedBy: confirmer,
                    changedAt: dayjs(log.changedAt).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        };

        res.status(200).json({ status: 'success', data: formattedBooking });
    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
};

export const updateBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.updateBooking(req.params.id, req.body);

        const { user: creator, createdAt, updatedAt, ...bookingRest } = booking;

        const formattedBooking = {
            ...bookingRest,
            createdBy: creator,
            bookingDate: dayjs(bookingRest.bookingDate).format('YYYY-MM-DD HH:mm:ss'),
            travelDate: dayjs(bookingRest.travelDate).format('YYYY-MM-DD'),
            statusLogs: bookingRest.statusLogs.map((log) => {
                const { user: confirmer, ...logRest } = log;

                return {
                    ...logRest,
                    changedBy: confirmer,
                    changedAt: dayjs(log.changedAt).format('YYYY-MM-DD HH:mm:ss')
                };
            })
        };

        res.status(200).json({
            status: 'success',
            data: formattedBooking
        });
    } catch (error) {
        error.statusCode = 400;
        next(error);
    }
};

export const updateBookingStatus = async (req, res, next) => {
    try {
        const updaterId = req.user.userId;
        const { status, note } = req.body;
        const booking = await bookingService.updateBookingStatus(req.params.id, status, note, updaterId);

        const { user: creator, createdAt, updatedAt, ...bookingRest } = booking;

        const formattedBooking = {
            ...bookingRest,
            createdBy: creator,
            bookingDate: dayjs(booking.bookingDate).format('YYYY-MM-DD HH:mm:ss'),
            travelDate: dayjs(booking.travelDate).format('YYYY-MM-DD'),
            statusLogs: bookingRest.statusLogs.map((log) => {
                const { user: confirmer, ...logRest } = log;

                return {
                    ...logRest,
                    changedBy: confirmer,
                    changedAt: dayjs(log.changedAt).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        };

        res.status(200).json({ status: 'success', data: formattedBooking });
    } catch (error) {
        error.statusCode = 400;
        next(error);
    }
};

export const deleteBooking = async (req, res, next) => {
    try {
        await bookingService.deleteBooking(req.params.id);
        res.status(200).json({ status: 'success', message: 'Booking deleted successfully' });
    } catch (error) {
        next(error);
    }
};