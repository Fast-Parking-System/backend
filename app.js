require('dotenv').config();
const express = require('express');
const app = express();

const router = require('./routes/index.js');

app.use(express.json());
app.set('view engine', 'ejs');
app.use('/api', router);

app.get('/', function (req, res) {
    res.json({
        status: true,
        message: 'welcome to fast-parking-system api',
        error: null,
        data: null
    });
});

const PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log('server running on port', PORT);
});