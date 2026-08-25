import * as authService from '../services/auth.service.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        
        // Set Refresh Token in HTTP-only Cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Only return accessToken and user data
        const { refreshToken, ...dataWithoutRefreshToken } = result;
        res.status(200).json({ status: 'success', data: dataWithoutRefreshToken });
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new Error('Refresh Token is missing from cookies');
        }
        const result = await authService.refreshToken(refreshToken);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
}

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await authService.getProfile(userId);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        await authService.logout(userId);
        res.clearCookie('refreshToken');
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const newUser = await authService.createUser(req.body);
        res.status(201).json({ status: 'success', message: 'Create new account success', data: newUser });
    } catch (error) {
        error.statusCode = 400;
        next(error);
    }
}