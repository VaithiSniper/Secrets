//jshint esversion:6
require('dotenv').config()
const md5 = require('md5')
const express = require('express')
const app = express()
const ejs = require('ejs')
const mongodb = require('mongodb')
const session = require('express-session')
const passport = require("passport")
var LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose')
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

app.use(session({
    secret: 'mytasteinmusicisyourface',
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
//Express-session related

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/secretsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
const Schema = mongoose.Schema
const userSchema = new Schema({
    email: String,
    password: String
})
userSchema.plugin(passportLocalMongoose)
const User = mongoose.model("user", userSchema)
//Mongoose related

passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function (req, res) {
    res.render('home', {})
})
app.get('/login', function (req, res) {
    res.render('login', {})
})
app.get('/register', function (req, res) {
    res.render('register', {})
})
app.get("/secrets",function(req,res)
{
    if(req.isAuthenticated())
{
    res.render('secrets',{})
}
else
res.redirect("/login")
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
    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //     const newUser = new User({
    //         email: req.body.email,
    //         password: hash
    //     })
    //     newUser.save();
    //     res.redirect("/")
    // });
    User.register({
        username: req.body.email,
        password: req.body.password
    },function(err,resu){
        if(!err)
        {
            if(!resu)
            {console.log("User not found")}
            else
            {
                passport.authenticate("local")(req , res, function(){
                    res.redirect("/secrets")
                })
            }
        }
    })
})
app.listen('3000', function (req, res) {
    console.log("Server up and running")
})
//HTTP VERBS