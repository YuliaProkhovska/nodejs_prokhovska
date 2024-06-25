require('dotenv').config();

const express = require("express");
const bodyParser = require('body-parser');
require('./db/mongoose.js');
const User = require('./routes/user.js')
const Task = require('./routes/task.js')
const Auth = require('./routes/auth.js');
const app = express();

const port = process.env['PORT']
app.use(bodyParser.json());

app.use('/',Task);
app.use('/',User);
app.use('/',Auth);
console.log (port);

app.listen(port, () => {
    console.log(`Server is listening on ${port} port`)
})