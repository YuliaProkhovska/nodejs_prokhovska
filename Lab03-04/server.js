
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
// Підключення маршутів
const userRoutes = require('./routes/User');
const authRoutes = require('./routes/authorization');
const taskRoutes = require('./routes/Tasks');
const userListRoutes = require('./routes/UsersShow');
// Екземпляр Express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}));

function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});
// Налаштування для файлів .hbs
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
// Підключення до бд MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology:
        true })
    .then(() => console.log('MongoDB Connected')) // Перевірка звязку з бд
    .catch(err => console.error(err));
// Підключаємо маршрути до додатка
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/user/tasks', requireAuth, taskRoutes);
app.use(userListRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
    res.redirect('/auth/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));