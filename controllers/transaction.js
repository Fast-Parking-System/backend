const db = require('../database');

async function renderCheckoutPage(req, res, next) {
    try {
        const userId = req.params.user_id;

        const [users] = await db.query('SElECT users.id, users.full_name, locations.name location FROM users JOIN locations ON locations.id = users.location_id WHERE users.id = ?', [userId]);

        res.render('checkout', { user_id: users[0].id, attendant_name: users[0].full_name, location: users[0].location, nominal: 2000 });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    renderCheckoutPage
};