require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyPaser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//define number of rounds
const saltRounds = 10;

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyPaser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    const userame = req.body.username;
    const password = req.body.password;
    User.findOne({email: userame}, function(err, foundUser){
        if (err) {
            console.log(err);
        }else{
            if (foundUser){
                //check the password
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            }
        }
    })
})

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    //salting and hashing 
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            //get hash value from function
            password: hash
        });
        newUser.save(function(err){
            if (!err) {
                res.render("secrets");
            } else {
                res.console.log(err);
            };
        });
    });
});




app.listen(port, function(){
    console.log("server started on port 3000");
});