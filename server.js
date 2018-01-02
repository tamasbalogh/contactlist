let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27018/contactlist-backend-db');

app.all('/', function (req, res) {
    res.send('Contactlist homepage')
})

app.all('/api/v1/*', require('./app/auth/validateRequest'));
app.use('/api', require('./routes/index'));

app.listen(3000);
console.log("Server running on port 3000");