//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
let userSchema = new mongoose.Schema({
  email: String,
  password: String
});



let User = mongoose.model("User",userSchema);

app.get('/',function(req,res){
  res.render('home');
});
app.get('/login',function(req,res){
  res.render('login');
});
app.get('/register',function(req,res){
  res.render('register');
});

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if (err) console.log(err);
      else res.render("secrets");
    });
  });

});

app.post("/login",function(req,res){

  const username = req.body.username;
  User.findOne({email:username},function(err,found){
    if (err) console.log(err);
    else
    {
      if (found)
      {
        bcrypt.compare(req.body.password, found.password, function(err, result) {
          if (result) res.render("secrets");
          else res.send("<h1>they aren't matching<h1>");
        });
      }
    }
  });
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
