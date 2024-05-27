// auth.js
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
const pantryModel = require('../models/pantryModel');
const jwt = require("jsonwebtoken");


exports.login = function(req, res, next) {
  
  let username = req.body.username;
  let password = req.body.password;

  userModel.lookup(username, function (err, user)
  {
    if(err)
    {
      console.log("Error looking up user", err);
      return res.status(401).send();
    }
    if(!user)
    {
      console.log("User " , username, "Not Found");
      return res.render("user/register");

    }
    console.log(user)

    bcrypt.compare(password, user.password, function(err, result)
    {
      console.log(result)

      if (result)
      {
        let payload = {username: username, role: user.role};

        let accessToken =jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn: 300});
        res.cookie("jwt", accessToken);
        next();
      }
      else
      {
        return res.render("User/login")
      }
    });
  });
}

exports.verify = function(req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }

    try {
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (e) {
        res.status(401).send();
    }
};
exports.verifyAdmin = function(req, res, next) {
  let accessToken = req.cookies.jwt;
  if (!accessToken) {
      return res.status(403).send();
  }

  try {
      let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (payload.role === 'admin') {
          next();
      } else {
          res.status(403).send('Access forbidden. Admin role required.');
      }
  } catch (e) {
      res.status(401).send();
  }
};
exports.verifyPantry = function(req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }

    try {
        let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (payload.role === 'pantry') {
            next();
        } else {
            res.status(403).send('Access forbidden. Pantry role required.');
        }
    } catch (e) {
        res.status(401).send();
    }
};
