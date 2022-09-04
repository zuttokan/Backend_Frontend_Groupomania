const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Signup
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      if (req.body.password.length < 6) {
        throw new Error('Error password length');
      }
      const user = new User({
        email: req.body.email,
        password: hash,
        isAdmin: req.body.email === process.env.isAdmin ? true : false,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({
            message: 'User created !',
          })
        )
        .catch((error) =>
          res.status(400).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};

// Login
exports.login = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: 'User not Found !',
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: 'incorrect password !',
            });
          }
          res.status(200).json({
            userEmail: req.body.email,
            userId: user._id,
            isAdmin: user.isAdmin,
            token: jwt.sign(
              {
                userId: user._id,
                isAdmin: user.isAdmin,
              },
              process.env.TOKEN_SECRET,
              {
                expiresIn: '24h',
              }
            ),
          });
        })
        .catch((error) =>
          res.status(500).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};
