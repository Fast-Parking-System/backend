const db = require('../database');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { capitalizeWords } = require('./location');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

async function register(req, res, next) {
    try {
        const fullName = req.body.full_name;
        const mobile = req.body.mobile;
        const locationId = req.body.location_id;
        const gender = req.body.gender;
        const password = req.body.password;
        const isAdmin = req.body.is_admin;

        const [existingUser] = await db.query('SELECT * FROM users WHERE full_name=?', [fullName]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'User already exists',
                data: null
            });
        }

        const results = await db.query('INSERT INTO users (full_name, mobile, location_id, gender, password, is_admin) VALUES (?,?,?,?,?,?)', [fullName, mobile, locationId, gender, password, isAdmin]);

        const userId = results[0].insertId.toString().padStart(6, '0');

        res.json({
            status: true,
            message: 'OK',
            error: null,
            data: { user_id: userId }
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const userId = req.body.user_id;
        const password = req.body.password;

        const [users] = await db.query('SELECT * FROM users WHERE id=?', [parseInt(userId, 10)]);
        if (users.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'User not registered',
                data: null
            });
        }

        if (users[0].password !== password) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'Wrong password',
                data: null
            });
        }

        users[0].id = userId;
        const token = jwt.sign(users[0], JWT_SECRET_KEY);

        res.json({
            status: true,
            message: 'OK',
            error: null,
            data: {
                token,
                is_admin: Boolean(users[0].is_admin),
                user_id: Number(users[0].id)
            }
        });
    } catch (err) {
        next(err);
    }
}

async function whoami(req, res) {
    const domain = `${req.protocol}://${req.get('host')}`;
    const qrCode = await generateQrCode(`${domain}/api/attendants/${req.user.id}/pay`);

    const [locations] = await db.query('SELECT * FROM locations WHERE id=?', [req.user.location_id]);

    res.json({
        status: true,
        message: 'OK',
        error: null,
        data: { ...req.user, qr_code: qrCode, location: locations[0].name }
    });
}

async function getAttendants(req, res, next) {
    try {
        let search = req.query.search;
        let location_id = req.query.location_id;

        let query = `
            SELECT users.id, users.full_name, locations.name AS location
            FROM users
            LEFT JOIN locations ON locations.id = users.location_id
            WHERE NOT users.is_admin`;
        let conditions = [];

        if (search) {
            query += ' AND users.full_name LIKE ?';
            conditions.push(`%${search}%`);
        }
        if (location_id) {
            query += ' AND locations.id = ?';
            conditions.push(location_id);
        }

        [results] = await db.query(query, conditions);

        const domain = `${req.protocol}://${req.get('host')}`;
        const qrCode = await generateQrCode(`${domain}/api/attendants/${req.user.id}/pay`);
        results.map(r => {
            r.id = r.id.toString().padStart(6, '0');
            r.full_name = capitalizeWords(r.full_name);
            r.location = capitalizeWords(r.location);
            r.qr_code = qrCode;
            return r;
        });

        res.json({
            status: true,
            message: 'OK',
            error: null,
            data: results
        });
    } catch (err) {
        next(err);
    }
}

async function generateQrCode(data) {
    const url = await QRCode.toDataURL(data, {
        color: {
            light: '#0000' // Transparent background
        }
    });
    return url.split(',')[1];
}

module.exports = {
    register,
    login,
    whoami,
    getAttendants
};
