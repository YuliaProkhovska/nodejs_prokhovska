const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
// Маршрут для обробки даних входу
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).send('Invalid email or password');
            return;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            req.session.userId = user._id;
// Перевіряємо роль користувача
            if (user.role === 'superuser') {
                res.redirect('/user/userlist'); // Перенаправляємо суперкористувача насторінку списку користувачів
            } else {
                res.redirect('/user/tasks'); // Перенаправляємо звичайного користувача насторінку із завданнями
            }
        } else {
            res.status(401).send('Invalid email or password');}
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Маршрут для відображення сторінки входу
router.get('/login', (req, res) => {
    res.render('login_Form');
});
// Маршрут для виходу користувача із системи
router.get('/logout', (req, res) => {
// Видаляємо сесію користувача
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/auth/login');
        }
    });
});
module.exports = router;