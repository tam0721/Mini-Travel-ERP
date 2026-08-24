import 'dotenv/config';
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    await prisma.bookingStatusLog.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('123456789', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@minitravel.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    const sale = await prisma.user.create({
        data: {
            name: 'Sale User',
            email: 'sale@minitravel.com',
            password: hashedPassword,
            role: 'SALES'
        } 
    });

    const booking1 = await prisma.booking.create({
        data: {
            customerName: 'Customer 1',
            customerPhone: '0123456789',
            tourName: 'Tour 1',
            travelDate: new Date('2026-09-01T00:00:00Z'),
            status: 'CONFIRMED',
            notes: 'This is a test booking 1',
            createdBy: sale.id
        }
    });

    const booking2 = await prisma.booking.create({
        data: {
            customerName: 'Customer 2',
            customerPhone: '0123456789',
            tourName: 'Tour 2',
            travelDate: new Date('2026-09-01T00:00:00Z'),
            status: 'CANCELLED',
            notes: 'This is a test booking 2',
            createdBy: sale.id
        }
    });

    const booking3 = await prisma.booking.create({
        data: {
            customerName: 'Customer 3',
            customerPhone: '0123456789',
            tourName: 'Tour 3',
            travelDate: new Date('2026-09-01T00:00:00Z'),
            status: 'PENDING',
            notes: 'This is a test booking 3',
            createdBy: sale.id
        }
    });

    await prisma.bookingStatusLog.create({
        data: {
            bookingId: booking1.id,
            oldStatus: 'PENDING',
            newStatus: 'CONFIRMED',
            changedBy: admin.id
        }
    });

    await prisma.bookingStatusLog.create({
        data: {
            bookingId: booking2.id,
            oldStatus: 'PENDING',
            newStatus: 'CANCELLED',
            changedBy: admin.id
        }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });