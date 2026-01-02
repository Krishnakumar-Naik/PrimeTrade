const Task = require('../models/taskModel');

const getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
};

const createTask = async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !description) {
        res.status(400).json({ message: 'Please add title and description' });
        return;
    }

    const task = new Task({
        user: req.user._id,
        title,
        description,
        status,
        priority,
        dueDate,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
};

const updateTask = async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (task) {
        if (task.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        if (task.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
