const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');

const mongoose = require('mongoose');
const taskRouter = require('./routes/task');

// Middlewares
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/static', express.static(__dirname + '/public'))

// Constants
const PORT = process.env.PORT || 8080;
const HOST = 'localhost';


mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('Connected to database!');
    app.listen(PORT, () => console.log(`Running on http://${HOST}:${PORT}`));
});


app.use((req, res, next) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const date = `${year}:${month}:${day} ${hour}:${minutes}:${seconds}`;
    const log = `${date} ${req.method} ${req.url} ${req.get('user-agent')}\n`;

    console.log(log);
    fs.appendFile(__dirname + '/public/logs.txt', log, () => {});
    next();
});

app.get('/', (req, res) => {
    console.log('process.env', process.env);

    res.status(200).send('<h1>Main page</h1>');
});

app.use(taskRouter);
