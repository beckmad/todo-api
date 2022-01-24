const Task = require('../models/Task');
const { getSuccessResponse } = require('../constants');

const getTasks = (req, res) => {
    Task.find({}, (error, tasks) => {
        if (error) return res.status(500).send(error);

        res.status(200).send(getSuccessResponse(tasks));
    });
}

const getTaskById = (req, res) => {
    const id = req.body.id;

    Task.find({ _id: id }, (err, tasks) => {
        if (err) return res.status(500).send(err);

        res.status(200).send(getSuccessResponse(tasks[0]));
    });
}

const addTask = async (req, res) => {
    const task = new Task({
        label: req.body.label,
        done: req.body.done,
        important: req.body.important,
    });

    await task.save((err) => {
        if (err) res.status(500).send(err);

        res.status(200).send(getSuccessResponse({}));
    });
}

const updateTask = (req, res) => {
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
}

const removeTask = (req, res) => {
    const id = req.body.id;

    Task.findByIdAndDelete(id, (err) => {
        if (err) return res.send(500, err);

        res.status(200).send(getSuccessResponse({ id }));
    });
}

module.exports = {
    getTasks,
    getTaskById,
    addTask,
    updateTask,
    removeTask
}