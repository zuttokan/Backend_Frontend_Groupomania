// imports
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); //--Middleware d'authentification
const multer = require('../middleware/multer-config'); //--Middleware de gestion des fichiers

const postCtrl = require('../controllers/post');

//*****Routes des posts
router.get('/', auth, postCtrl.getAllPosts); //--Route GET qui renvoie toutes les Posts dans la base de données
router.post('/', auth, multer, postCtrl.createPost); //--Ajouter un nouveau post
router.get('/:id', auth, postCtrl.getOnePost); //--Récupération d'un Post spécifique
router.put('/:id', auth, multer, postCtrl.modifyPost); //--Mettre à jour un Post existant
router.delete('/:id', auth, postCtrl.deletePost); //--Suppression d'un Post
router.post('/:id/like', auth, postCtrl.likePost); //*****Route des likes

//___________________Exportation des routes_________________//
module.exports = router;