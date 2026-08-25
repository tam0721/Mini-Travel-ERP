import prisma from "../config/database.js";

export const createBooking = async (data, creatorId) => {
    return await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.create({
            data: {
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone : data.customerPhone,
                tourName: data.tourName,
                travelDate: new Date(data.travelDate),
                totalPrice: data.totalPrice,
                status: 'PENDING',
                createdBy: creatorId
            }
        });

        await tx.bookingStatusLog.create({
            data: {
                bookingId: booking.id,
                oldStatus: 'PENDING',
                newStatus: 'PENDING',
                changedBy: creatorId,
                note: 'Create booking'
            }
        });

        return booking;
    });
};

export const getAllBookings = async ({ status, keyword, page = 1, limit = 10, sort = 'created_at_desc' } = {}) => {
    const where = {
        deletedAt: null,
        ...(status && { status: status.toUpperCase() }),
        ...(keyword && {
            OR: [
                { customerName: { contains: keyword } },
                { customerEmail: { contains: keyword } },
                { tourName: { contains: keyword } }
            ]
        })
    };

    const sortMap = {
        created_at_desc: { createdAt: 'desc' },
        created_at_asc: { createdAt: 'asc' },
        travel_date_desc: { travelDate: 'desc' },
        travel_date_asc: { travelDate: 'asc' }
    };

    const orderBy = sortMap[sort] ?? { createdAt: 'desc' };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await prisma.$transaction([
        prisma.booking.findMany({
            where,
            orderBy,
            skip,
            take: limitNum,
            include: { user: { select: { name: true } } }
        }),

        prisma.booking.count({ where })
    ]);

    return {
        data,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPage: Math.ceil(total / limitNum)
        }
    };
};

export const getBookingById = async (id) => {
    const booking = await prisma.booking.findUnique({
        where: { 
            id: parseInt(id),
            deletedAt: null 
        },
        include: {
            user: { select: { name: true } },
            statusLogs: {
                orderBy: { changedAt: 'desc' },
                include: { user: { select: { name: true } } }
            }
        }
    });

    if (!booking) throw new Error('Booking not found');

    return booking;
};

export const updateBookingStatus = async (id, newStatus, note, updaterId) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: parseInt(id),
            deletedAt: null
        }
    });
    if (!booking) throw new Error('Booking not found');
    if (booking.status === newStatus) throw new Error('Status has been changed');

    return await prisma.booking.update({
        where: { id: parseInt(id) },
        data: {
            status: newStatus,
            statusLogs: {
                create: {
                    oldStatus: booking.status,
                    newStatus: newStatus,
                    changedBy: updaterId,
                    note: note || ''
                }
            }
        },
        include: {
            user: { select: { name: true } },
            statusLogs: {
                orderBy: { changedAt: 'desc' },
                include: { user: { select: { name: true } } }
            }
        }
    });
};

export const updateBooking = async (id, data) => {
    const booking = await prisma.booking.findUnique({
        where: { 
            id: parseInt(id),
            deletedAt: null
        }
    });

    if (!booking) throw new Error('Booking not found');

    return await prisma.booking.update({
        where: { id: parseInt(id) },
        data: {
            ...(data.customerName && { customerName: data.customerName }),
            ...(data.customerEmail && { customerEmail: data.customerEmail }),
            ...(data.customerPhone && { customerPhone: data.customerPhone }),
            ...(data.tourName && { tourName: data.tourName }),
            ...(data.travelDate && { travelDate: new Date(data.travelDate) }),
            ...(data.totalPrice && { totalPrice: data.totalPrice }),
            ...(data.notes !== undefined && { notes: data.notes })
        },
        include: {
            user: { select: { name: true } },
            statusLogs: {
                orderBy: { changedAt: 'desc' },
                include: { user: { select: { name: true } } }
            }
        }
    });
};

export const deleteBooking = async (id) => {
    await prisma.booking.update({ 
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() }
    });

    return { message: 'Successfully delete booking' };
};