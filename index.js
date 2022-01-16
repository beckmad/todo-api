const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');

const mongoose = require('mongoose');
const Task = require('./models/Task');
const jsonParser = express.json();
const { getSuccessResponse } = require('./constants');

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

app.get('/task/getTasks', (req, res) => {
    Task.find({}, (error, tasks) => {
        if (error) return res.status(500).send(error);

        res.status(200).send(getSuccessResponse(tasks));
    });
});

app.post('/task/getTaskById', jsonParser, (req, res) => {
    const id = req.body.id;

    Task.find({ _id: id }, (err, tasks) => {
        if (err) return res.status(500).send(err);

        res.status(200).send(getSuccessResponse(tasks[0]));
    });
});

app.post('/task/addTask', jsonParser, async (req, res) => {
    const task = new Task({
        label: req.body.label,
        done: req.body.done,
        important: req.body.important,
    });

    await task.save((err) => {
        if (err) res.status(500).send(err);

        res.status(200).send(getSuccessResponse({}));
    });
});

app.post('/task/updateTask', jsonParser, (req, res) => {
    if (!req.body.newTask)
        return res.status(422).send({ message: 'Отсутствует обязательный параметр newTask' });

    const id = req.body.id;
    const updatedTask = {
        label: req.body.newTask.label,
        done: req.body.newTask.done,
        important: req.body.newTask.important,
    };

    Task.findByIdAndUpdate(id, updatedTask, (err) => {
        if (err) return res.send(500, err);

        res.status(200).send(getSuccessResponse({ id }));
    });
});

app.post('/task/removeTask', jsonParser, (req, res) => {
    const id = req.body.id;

    Task.findByIdAndDelete(id, (err) => {
        if (err) return res.send(500, err);

        res.status(200).send(getSuccessResponse({ id }));
    });
});
