const db = require('../database');
const jwt = require('jsonwebtoken');
const qr = require('qr-image');
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
            data: { token, is_admin: users[0].is_admin }
        });
    } catch (err) {
        next(err);
    }
}

function whoami(req, res) {
    res.json({
        status: true,
        message: 'OK',
        error: null,
        data: req.user
    });
}

async function getAttendants(req, res, next) {
    try {
        let { search } = req.query;

        let results;
        if (search) {
            [results] = await db.query(`
            SELECT users.id, users.full_name, locations.name AS location
            FROM users
            LEFT JOIN locations ON locations.id = users.location_id
            WHERE NOT users.is_admin AND users.full_name LIKE ?`, [`%${search}%`]);
        } else {
            [results] = await db.query(`
            SELECT users.id, users.full_name, locations.name AS location
            FROM users
            LEFT JOIN locations ON locations.id = users.location_id
            WHERE NOT users.is_admin`);
        }

        const domain = `${req.protocol}://${req.get('host')}`;
        results.map(r => {
            let id = r.id;
            r.qr_code = qr.imageSync(`${domain}/api/attendants/${id}/pay`, { type: 'png' }).toString('base64');
            r.id = r.id.toString().padStart(6, '0');
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

module.exports = {
    register,
    login,
    whoami,
    getAttendants
};
