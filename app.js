//jshint esversion:6
require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const mongodb = require('mongodb')
const encrypt = require('mongoose-encryption')
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}));
//Module related
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

userSchema.plugin(encrypt, {
    secret: process.env.SECRET,
    encryptedFields: ['password']
});
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
    User.find({
        email: req.body.email,
        password: req.body.password
    }, function (err, result) {
        if (!err) {
            if (!result)
                res.send("<h1>Auth FAILED, TRY AGAIN</h1>")
            else
                res.redirect("/")
        }
    })
})
app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    })
  
    newUser.save();
    res.redirect("/")
})
app.listen('3000', function (req, res) {
    console.log("Server up and running")
})