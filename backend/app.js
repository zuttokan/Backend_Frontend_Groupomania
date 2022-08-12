const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

mongoose
  .connect(process.env.SECRET_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log(e, 'Connexion à MongoDB échouée !'));

app.use(
  helmet({
    ccrossOriginResourcePolicy: {
      policy: 'same-site',
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

//--En-tête de sécurité CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// configuration du dossier "images" qui accueillera les images des sauces et qui sera mis à jour
app.use('/images', express.static(path.join(__dirname, 'images'))); //--driname : Importation de node appelée path qui nous donne accès au chemin de notre système de fichier
app.use('/api/auth', userRoutes); //Racine de tout ce qui est lié à l'authentification
app.use('/api/post', postRoutes); //Racine de tout ce qui est lié aux posts

app.use((req, res) => {
  res.json({
    message: 'requête bien reçue !',
  });
});

// Exportation
module.exports = app;
