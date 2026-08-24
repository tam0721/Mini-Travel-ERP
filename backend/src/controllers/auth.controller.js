import * as authService from '../services/auth.service.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
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
        const result = await authService.logout(userId);
        res.status(200).json({ status: 'success', message: result.message });
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