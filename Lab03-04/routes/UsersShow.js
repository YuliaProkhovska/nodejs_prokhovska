const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Маршрут для відображення сторінки списку користувачів
router.get('/userlist', async (req, res) => {
    try {
// Фільтруємо користувачів, щоб відобразити тільки тих, хто не є суперкористувачами
        const users = await User.find({ role: { $ne: "superuser" } });
        res.render('usersShowList', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// Маршрут для видалення користувача
router.post('/user/delete/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {// Видаляємо користувача за його ідентифікатором
        await User.findByIdAndDelete(userId);
        res.redirect('/user/userlist');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete user');
    }
});
module.exports = router;