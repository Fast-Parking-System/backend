require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

const router = require('./routes/index.js');
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