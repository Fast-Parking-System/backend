const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function validate(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized',
            error: errorMessage,
            data: null
        });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized',
                error: errorMessage,
                data: null
            });
        }

        req.user = decoded;
        next();
    });
}

module.exports = validate;