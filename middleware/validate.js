const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function validate(req, res, next) {
    console.log("req.header")
    console.log(req.headers.authorization)
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized',
            error: null,
            data: null
        });
    }

    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized',
                error: err.message,
                data: null
            });
        }

        req.user = decoded;
        next();
    });
}

module.exports = validate;