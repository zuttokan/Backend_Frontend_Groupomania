//--Cryptage des mots de passes
const bcrypt = require('bcrypt'); //--Fonction de hachage ou Package de chiffrement
const jwt = require('jsonwebtoken'); //--permet l'échange sécurisé de jetons entre plusieurs parties pour vérifier l’authenticité et l’intégrité des données
const User = require('../models/user');

//--Enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        isAdmin: req.body.email === process.env.isAdmin ? true : false,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({
            message: 'Utilisateur créé !',
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
//--Connecter un utilisateur existant
exports.login = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !',
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !',
            });
          }
          res.status(200).json({
            userEmail: req.body.email,
            userId: user._id,
            token: jwt.sign(
              {
                userId: user._id,
              },
              process.env.TOKEN_SECRET,
              {
                // Clé secrète pour l'encodage
                expiresIn: '24h', // Le token expirera au bout de 24h
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
// exports.logout = (req, res) => {
//   res.cookie('jwt', '', { maxAge: 1 });
//   res.clearCookie('jwt');
//   res.status(200).json({ message: 'Réussi' });
// };
