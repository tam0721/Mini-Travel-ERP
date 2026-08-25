import * as dashboardService from '../services/dashboard.service.js';
import dayjs from 'dayjs';

export const getDashboard = async (req, res, next) => {
    try {
        const summary = await dashboardService.getDashboard();
        
        const formattedRecentBookings = summary.recentBookings.map((b) => ({
            ...b,
            travelDate: dayjs(b.travelDate).format('YYYY-MM-DD'),
            createdAt: dayjs(b.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })); 

        res.status(200).json({
            status: 'success',
            data: {
                ...summary,
                recentBookings: formattedRecentBookings
            }
        });
    } catch (error) {
        next(error);
    }
};