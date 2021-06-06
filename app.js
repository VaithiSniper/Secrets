//jshint esversion:6
require('dotenv').config()
const md5 = require('md5')
const express = require('express')
const app = express()
const ejs = require('ejs')
const mongodb = require('mongodb')
// const encrypt = require('mongoose-encryption')
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}));
//Module related

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
//bcrypt related

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/secretsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const Schema = mongoose.Schema
const userSchema = new Schema({
    email: String,
    password: String
})
// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET,
//     encryptedFields: ['password']
// });
const User = mongoose.model("user", userSchema)
//Mongoose related

app.get('/', function (req, res) {
    res.render('home', {})
})
app.get('/login', function (req, res) {
    res.render('login', {})
})
app.get('/register', function (req, res) {
    res.render('register', {})
})
app.post('/login', function (req, res) {
    User.findOne({
        email: req.body.email,
    }, function (err, result) {
        if (!err) {
            if (!result)
                res.send("<h1>Auth FAILED, TRY AGAIN</h1>")
            else {
                bcrypt.compare(req.body.password, result.password, function (err, resu) {
                    if (resu === true) {
                        res.redirect("/")
                    } else {
                        res.send("Not found")
                    }

                })
            }
        }
    })
})
app.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.email,
            password: hash
        })
        newUser.save();
        res.redirect("/")
    });
})
app.listen('3000', function (req, res) {
    console.log("Server up and running")
})
//HTTP VERBS