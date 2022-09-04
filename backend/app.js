const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const path = require('path');
const helmet = require('helmet');

mongoose
  .connect(process.env.SECRET_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection successful !!'))
  .catch((e) => console.log(e, 'MongoDB connection failed  !'));

app.use(
  helmet({
    ccrossOriginResourcePolicy: {
      policy: 'same-site',
    },
  })
);

// CORS
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

// Folder "images" that will host the images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);

app.use((req, res) => {
  res.json({});
});

module.exports = app;
