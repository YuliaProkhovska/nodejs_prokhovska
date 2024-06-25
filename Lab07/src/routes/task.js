const express = require('express');
const Task = require('../models/task.js');
const Auth = require('../AuthMiddleware');

const router = express.Router();

router.get('/tasks', Auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/tasks/:id', Auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id });

        if (!task || task.owner.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Not found' });
        }
        if (!req.user) {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/tasks', Auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, owner: req.user._id });
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/tasks/:id', Auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/tasks/:id', Auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (task) {
            res.json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/tasks', Auth, async (req, res) => {
    try {
        await Task.deleteMany();
        res.json({ message: 'All tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;