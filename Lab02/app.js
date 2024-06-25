const express = require('express');
const hbs = require('hbs');
const ip = require('ipinfo');
const { Navigator } = require("node-navigator");
const navigator = new Navigator();
const list = require('./public/cities.json');

hbs.registerPartials(__dirname + '/views/partials');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home.hbs');
});

app.get('/weather/:city', async (req, res) => {
    const { city } = req.params;

    const apiKey = '3606ad5fe1f5bba6b232b5b00f2499d9';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`, {
        method: 'GET',
        mode: 'cors'
    })
        .then(response => response.json())
        .then(result => {
            console.log('Отримані дані від сервера OpenWeatherMap:', result); // Виводимо отримані дані на консоль для перевірки

            // Перевіряємо, чи містить отриманий об'єкт result очікувані властивості
            if (result.main && result.main.temp && result.weather && result.weather[0] && result.weather[0].icon && result.main.pressure && result.main.humidity) {
                // Якщо дані коректні, виконуємо рендерінг шаблону weather.hbs з отриманими даними
                res.render('weather.hbs', {
                    list,
                    temp: Math.round(result.main.temp - 273),
                    icon: `https://openweathermap.org/img/wn/${result.weather[0]['icon']}@4x.png`,
                    name: result.name,
                    pressure: result.main.pressure,
                    humidity: result.main.humidity
                });
            } else {
                // Якщо отримані дані не містять необхідні властивості, видаємо помилку 404
                console.error('Отримані дані не містять необхідні властивості');
                res.status(404).render("404.hbs");
            }
        })
        .catch(error => {
            // Обробляємо помилку
            console.error('Error fetching weather data:', error);
            res.status(404).render("404.hbs");
        });
});

app.get('/weather/', (req, res) => {
    ip((err, cLoc) => {
        res.redirect(`/weather/${cLoc.city}`);
    });
});

app.get('/weather-geo/', async (req, res) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const apiKey = '3606ad5fe1f5bba6b232b5b00f2499d9';
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.latitude}&lon=${pos.longitude}&exclude=hourly,daily&appid=${apiKey}`, {
            method: 'GET',
            mode: 'cors'
        })
            .then(response => response.json())
            .then(result => {
                res.render('weather.hbs', {
                    list,
                    temp: Math.round(result.current.temp - 273),
                    icon: `https://openweathermap.org/img/wn/${result.current.weather[0]['icon']}@4x.png`,
                    name: 'ваших поточних координатах',
                    pressure: result.current.pressure,
                    humidity: result.current.humidity
                });
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                res.status(404).render("404.hbs");
            });
    });
});

app.use((req, res, next) => {
    res.status(404).render("404.hbs");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});