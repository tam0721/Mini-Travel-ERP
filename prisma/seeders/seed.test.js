import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // Xóa đúng thứ tự khóa ngoại
    await prisma.bookingStatusLog.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.user.deleteMany()

    const hash = await bcrypt.hash('Test@123', 10)

    const admin = await prisma.user.create({
        data: { name: 'Admin Test', email: 'admin@test.com', password: hash, role: 'ADMIN' }
    })
    const sales = await prisma.user.create({
        data: { name: 'Sales Test', email: 'sales@test.com', password: hash, role: 'SALES' }
    })
    await prisma.user.create({
        data: { name: 'Operator Test', email: 'operator@test.com', password: hash, role: 'OPERATOR' }
    })

    // 20 booking mẫu để test search/filter/pagination
    const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
    for (let i = 1; i <= 20; i++) {
        await prisma.booking.create({
        data: {
            customerName: `Customer ${i}`,
            customerEmail: `customer${i}@test.com`,
            customerPhone: `090000000${i}`,
            tourName: `Tour ${String.fromCharCode(64 + (i % 5 + 1))}`,
            totalPrice: i * 1000000,
            travelDate: new Date(2026, i % 12, (i % 28) + 1),
            status: statuses[i % 4],
            createdBy: i % 2 === 0 ? sales.id : admin.id,
        }
        })
    }
    console.log('✅ Test seed done: 3 users + 20 bookings')
}

main().finally(() => prisma.$disconnect())