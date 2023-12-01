const db = require('../database');

async function renderCheckoutPage(req, res, next) {
    try {
        const userId = req.params.user_id;

        const [users] = await db.query('SElECT users.id, users.full_name, locations.name location FROM users JOIN locations ON locations.id = users.location_id WHERE users.id = ?', [userId]);

        res.render('checkout', { user_id: users[0].id, attendant_name: users[0].full_name, location: users[0].location, amount: 2000 });
    } catch (err) {
        next(err);
    }
}

async function createTransaction(req, res, next) {
    try {
        const userId = req.params.user_id;
        const amount = req.body.amount;

        const results = await db.query('INSERT INTO transactions (user_id, amount) VALUES (?,?)', [userId, amount]);

        res.render('success');
    } catch (err) {
        next(err);
    }
}

async function analytics(req, res, next) {
    try {
        const userId = req.params.user_id;

        // Get daily transactions
        const [dailyResults] = await db.query(`
            SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') as date, CAST(SUM(amount) AS SIGNED) as amount
            FROM transactions
            WHERE user_id = ?
            GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d')
            ORDER BY date DESC
        `, [userId]);

        // Get weekly transactions
        const [weeklyResults] = await db.query(`
            SELECT DATE_FORMAT(MIN(timestamp), '%Y-%m-%d') as start_date, DATE_FORMAT(MAX(timestamp), '%Y-%m-%d') as end_date, CAST(SUM(amount) AS SIGNED) as amount
            FROM transactions
            WHERE user_id = ?
            GROUP BY WEEK(timestamp)
            ORDER BY start_date DESC
        `, [userId]);

        // Get monthly transactions
        const [monthlyResults] = await db.query(`
            SELECT DATE_FORMAT(timestamp, '%M %Y') as month, CAST(SUM(amount) AS SIGNED) as amount
            FROM transactions
            WHERE user_id = ?
            GROUP BY DATE_FORMAT(timestamp, '%M %Y')
            ORDER BY month DESC
        `, [userId]);

        // Get yearly transactions
        const [yearlyResults] = await db.query(`
            SELECT YEAR(timestamp) as year, CAST(SUM(amount) AS SIGNED) as amount
            FROM transactions
            WHERE user_id = ?
            GROUP BY YEAR(timestamp)
            ORDER BY year DESC
        `, [userId]);

        const analyticsResult = {
            daily: dailyResults,
            weekly: weeklyResults,
            monthly: monthlyResults,
            yearly: yearlyResults,
        };

        res.json(analyticsResult);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    renderCheckoutPage,
    createTransaction,
    analytics
};