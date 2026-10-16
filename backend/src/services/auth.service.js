import prisma from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (email, password) => {
    // 1. Check if user exist or not
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User Not Found!');

    // 2. Check if the given password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Incorrect Password!');

    // 3. Generate JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'secret123';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refreshSecret123';

    const payload = { userId: user.id, role: user.role };
    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

    // 4. Store refresh token
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken };
};

export const refreshToken = async (token) => {
    if (!token) throw new Error('Refresh token is required!');

    // 1. Verify refresh token
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refreshSecret123';
    const decoded = jwt.verify(token, refreshSecret);

    // 2. Compare stored refresh token with the one provided
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== token) throw new Error('Invalid Refresh Token!');

    // 3. Generate new Access Token (Do not change Refresh Token)
    const jwtSecret = process.env.JWT_SECRET || 'secret123';
    const newAccessToken = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '15m' });

    return { accessToken: newAccessToken };
};

export const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) throw new Error('User Not Found!');

    return user;
};

export const logout = async (userId) => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null }
    });

    return { message: 'Logout Success' };
};

export const createUser = async (data) => {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error('Email already exists');

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Store user in DB
    const newUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || 'SALES'
        },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    return newUser;
}