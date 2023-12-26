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

app.use((req, res, next) => {
    return res.status(404).json({
        status: false,
        message: 'Sorry can\'t find that!',
        error: null,
        data: null
    });
});

app.use((err, req, res, next) => {
    return res.status(500).json({
        status: false,
        message: 'somethink broke!',
        error: err.message,
        data: null
    });
});

const PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log('server running on port', PORT);
});