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

// Middleware для перевірки ролі суперкористувача
async function requireSuperuser(req, res, next) {
    const userId = req.session.userId;
    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'superuser') {
            res.status(403).send('Error403'); // Рендер шаблону для помилки 403
        } else {
            next(); // Продовжуємо виконання наступного маршруту
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// Маршрут для відображення сторінки реєстрації користувача
router.get('/registration', (req, res) => {
    res.render('registration_Form');
});

// Маршрут для обработки данных регистрации пользователя
router.post('/registration', async (req, res) => {
    const { nickname, email, password, age } = req.body;
    // Валідація пошти
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format');
    }
    // Валідація пароля
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit');
    }
    // Валідація віку
    if (age < 18) {
        return res.status(400).send('Age must be at least 18');
    }
    try {
        // Хешуємо пароль перед збереженням
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            nickname,
            email,
            password: hashedPassword, // Зберігаємо захешований пароль
            age,
            ID: 'NO',
            role: 'user'
        });
        await newUser.save();
        res.send('User registered successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршрут для відображення списку завдань для всіх користувачів
router.get('/tasks', requireAuth, async (req, res) => {
    try {
        const tasks = await Task.find(); // Відображення списку тасків
        res.render('userTasks', { tasks }); // Рендер шаблону із завданнями для всіх користувачів
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршрут для відображення сторінки списку користувачів
router.get('/userlist', requireSuperuser, async (req, res) => {
    try {
        const users = await User.find(); // Отримуємо список користувачів
        res.render('usersShowList', { users }); // Рендер шаблону зі списком користувачів
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/logout', (req, res) => {
    // Видаляємо дані про користувача із сесії
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/auth/login'); // Перенаправляємо користувача на сторінку входу
        }
    });
});

module.exports = router;
