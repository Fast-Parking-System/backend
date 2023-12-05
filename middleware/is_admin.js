function isAdmin(req, res, next) {
    if (!req.user.is_admin) {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized',
            error: 'only admin can access this route',
            data: null
        });
    }

    next();
}

module.exports = isAdmin;