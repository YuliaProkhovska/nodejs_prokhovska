const User = require('../models/user');
const express = require('express')
const router = express.Router();
const authMiddleware = require('../AuthMiddleware');

router.post('/users/login', async (req, res) => {

        const { email, password } = req.body;

        const user = await User.findOneByCredentials(email, password);

        const token = await user.generateAuthToken(user)

        res.send({ user: user, token: token, message: 'Login successful' });

});

router.post('/users/logout', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token !== req.token);
        await req.user.save();
        res.send({message: 'Logout successful'});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;