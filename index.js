const express = require('express');

const app = express();

const mongoose = require('mongoose');


//Import Routes
const authRoute = require('./routes/auth');

//Connect to DB
mongoose.connect('mongodb+srv://bobojon:bobojon@cluster0-i1mzm.mongodb.net/test', {useNewUrlParser: true}, (err) => console.log('connected to db!', err));

//MiddleWares

app.use(express.json());


//Route MiddleWares
app.use('/api/user', authRoute);


app.listen(3001, () => console.log('Server up and running'));
