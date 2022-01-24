const express = require('express');
const taskController = require('../controllers/taskController');
const jsonParser = express.json();

const taskRouter = express.Router();

taskRouter.get('/task/getTasks', taskController.getTasks);

taskRouter.post('/task/getTaskById', jsonParser, taskController.getTaskById);

taskRouter.post('/task/addTask', jsonParser, taskController.addTask);

taskRouter.post('/task/updateTask', jsonParser, taskController.updateTask);

taskRouter.post('/task/removeTask', jsonParser, taskController.removeTask);

module.exports = taskRouter;