import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized - No Token' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded;
        next();        
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Token Verification Failed' });
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ status: 'error', message: 'Forbidden - Only Admins Allowed' });
    }

    next();
}