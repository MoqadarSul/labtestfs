const bodyParser = require('body-parser')
const express = require('express')
const app = express();
const userModel = require('../models/User')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const jwt = require('jsonwebtoken')
const auth = require('../middleware/checkAuth')
const bcrypt = require("bcrypt");

//compare the two cookies and see if its valid cookie.
app.post('/signup', urlencodedParser, async (req, res) =>{
  const {username, firstname, lastname, password} = req.body;
  
  let checkIfUserExists = await userModel.find({'username' : username})
  if(checkIfUserExists.length != 0){
    return res.status(400).json({"errors" : [
      {
          "msg" : "This user already exists",
      }
  ]})
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new userModel({username, firstname, lastname, 'password' : hashedPassword})
  try{
    await user.save((err) =>{
      if(err){
        res.send(err)
      }else{
        res.send(user)
      }
    });
  }catch(err){
    res.status(500).send(err)
  }
  const token = await jwt.sign({username}, "fn32iusht3209hg32263nvh92", {expiresIn : 3600000});
   res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.redirect(`/loggedin.html?username=${username}`);
})


app.post('/login', urlencodedParser, async (req, res) =>{
    const {username, password} = req.body;
    let userfound = await userModel.find({'username' : username})
    
      if(userfound.length == 0){
        return res.status(400).json({"errors" : [
            {
                "msg" : "Invalid credentials",
            }
        ]})
    };
    let isMatch = await bcrypt.compare(password, userfound[0].password)
    if(!isMatch){
        return res.status(400).json({"errors" : [
            {
                "msg" : "Invalid credentials",
            }
        ]})
    };
    const token = await jwt.sign({username}, "fn32iusht3209hg32263nvh92", {expiresIn : 3600000});
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
     return res.redirect(`/loggedin.html?username=${username}`);
  })



app.get("/logout", auth, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
});

  module.exports = app