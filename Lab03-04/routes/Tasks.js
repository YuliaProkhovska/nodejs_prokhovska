const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Task = require('../models/Task');
const User = require('../models/User');
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(403);
        res.render('Error403'); // Рендер шаблону для помилки 403
    }
}
// Middleware для перевірки прав доступу до завдання
async function checkTaskOwnership(req, res, next) {
    const userId = req.session.userId;
    const taskId = req.params.taskId;
    try {
        const task = await Task.findOne({ _id: taskId, userId: userId });
        if (!task) {return res.status(404).render('Error404');
        }
        next(); // Продовжуємо виконання наступного маршруту, якщо користувач має доступдо завдання
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
// Маршрут для обробки POST-запиту на додавання нового завдання
router.post('/', requireAuth, async (req, res) => {
    const userId = req.session.userId;
    const { title, description } = req.body;
// Проверка наличия title в теле запроса
    if (!title) {
        return res.status(400).send('Title is required');
    }
    try {
        const newTask = new Task({ title, description, userId });
        await newTask.save();
        res.redirect('/user/tasks');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Маршрут GET для редагування завдання
router.get('/:taskId/edit', requireAuth, checkTaskOwnership, async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await Task.findById(taskId);
        res.render('TaskEditor', { task });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Маршрут POST для редагування завдання
router.post('/:taskId/edit', requireAuth, checkTaskOwnership, async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description },
            { new: true });if (!updatedTask) {
            return res.status(404).render('Error404'); // Рендер шаблону для помилки 404
        }
        res.redirect('/user/tasks');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Маршрут для видалення завдання
router.post('/:taskId/delete', requireAuth, checkTaskOwnership, async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).render('Error404'); // Рендер шаблону для помилки 404
        }
        res.redirect('/user/tasks');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;