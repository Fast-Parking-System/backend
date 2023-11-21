const db = require('../database');

async function create(req, res, next) {
    try {
        const name = req.body.name;
        const tags = req.body.tags;

        const result = await db.query('INSERT INTO locations (name, tags) VALUES (?, ?)', [name, tags.join(', ')]);

        res.json({
            status: true,
            message: 'OK',
            error: null,
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function list(req, res, next) {
    try {
        const search = req.query.search;

        let locations;
        if (search) {
            [locations] = await db.query('SELECT * FROM locations WHERE tags LIKE ? OR name LIKE ?', [`%${search}%`, `%${search}%`]);
        } else {
            [locations] = await db.query('SELECT * FROM locations');
        }

        res.json({
            status: true,
            message: 'OK',
            error: null,
            data: locations
        });
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const locationId = req.params.id;

        const [locations] = await db.query('SELECT * FROM locations WHERE id = ?', [locationId]);
        if (locations.length == 0) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'Location not found',
                data: null
            });
        }

        res.json({
            status: true,
            message: 'OK',
            error: null,
            data: locations[0]
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    create,
    list,
    detail
};