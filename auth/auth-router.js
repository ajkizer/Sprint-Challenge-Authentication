const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets")
const Users = require("./auth-model");

router.post('/register', (req, res) => {
  let user = req.body;
  if(user.username && user.password) {
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    Users.add(user).then(saved => {
      res.status(201).json(user)
    }).catch(error => {
      res.status(500).json("error");
    })
  } else {
    res.status(400).json({message: "please enter username"})
  }
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;

  Users.findBy({username}).first().then(user => {
    if(user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({
        message: `Welcome ${user.username}`, token
      });
    } else {
      res.status(401).json({message: "you lyin' dawg"});
    }
  }).catch(error => {
    res.status(500).json(error);
  })
});

function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.username
  }
  const options = {
    expiresIn: "1h"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
