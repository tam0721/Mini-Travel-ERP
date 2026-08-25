import prisma from '../config/database.js';

export const getDashboard = async () => {
    const [
        totalBookings,
        pendingCount,
        confirmedCount,
        completedCount,
        cancelledCount,
        revenueResult,
        recentBookings
    ] = await prisma.$transaction([
        prisma.booking.count({ where: { deletedAt: null } }),
        prisma.booking.count({ where: { status: 'PENDING', deletedAt: null } }),
        prisma.booking.count({ where: { status: 'CONFIRMED', deletedAt: null } }),
        prisma.booking.count({ where: { status: 'COMPLETED', deletedAt: null } }),
        prisma.booking.count({ where: { status: 'CANCELLED', deletedAt: null } }),
        prisma.booking.aggregate({
            where: {
                deletedAt: null,
                status: { in: ['CONFIRMED', 'COMPLETED'] }
            },
            _sum: { totalPrice: true }
        }),
        prisma.booking.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                customerName: true,
                tourName: true,
                totalPrice: true,
                status: true,
                travelDate: true,
                createdAt: true
            }
        })
    ]);

    return {
        totalBookings,
        bookingsByStatus: {
            PENDING: pendingCount,
            CONFIRMED: confirmedCount,
            COMPLETED: completedCount,
            CANCELLED: cancelledCount
        },
        totalRevenue: revenueResult._sum.totalPrice ?? 0,
        recentBookings
    };
};