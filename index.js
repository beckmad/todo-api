const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');

const mongoose = require('mongoose');
const Task = require('./models/Task');
const jsonParser = express.json();
const { getSuccessResponse } = require('./constants');

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('Connected to database!');
    app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
});

app.get('/', (req, res) => {
    console.log('/');

    res.status(200).write('<h1>Main page</h1>>');
});

app.get('/task/getTasks', (req, res) => {
    console.log('/getTasks');

    Task.find({}, (error, tasks) => {
        if (error) return res.status(500).send(error);

        res.status(200).send(getSuccessResponse(tasks));
    });
});

app.post('/task/getTaskById', jsonParser, (req, res) => {
    console.log('/getTaskById');

    const id = req.body.id;

    Task.find({ _id: id }, (err, tasks) => {
        if (err) return res.status(500).send(err);

        res.status(200).send(getSuccessResponse(tasks[0]));
    });
});

app.post('/task/addTask', jsonParser, async (req, res) => {
    console.log('/addTask');

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
    console.log('/updateTask');

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
    console.log('/removeTask');

    const id = req.body.id;

    Task.findByIdAndDelete(id, (err) => {
        if (err) return res.send(500, err);

        res.status(200).send(getSuccessResponse({ id }));
    });
});
