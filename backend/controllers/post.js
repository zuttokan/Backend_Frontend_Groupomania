//--Logique métier des routes
const Post = require('../models/post');
//--Donne accès aux fonctions qui permettent de modifier le système de fichier y compris les fonctions qui permettent de supprimer
const fs = require('fs');

//**********Création d'un post
exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post);
    delete postObject._id;
    const post = new Post({
        ...postObject,
        likes: 0,
        usersLiked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        date: new Date(Date.now())
    });

    post.save()
        .then(() => res.status(201).json({
            message: 'publication enregistrée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

//**********Récupération d'un post
exports.getOnePost = (req, res, next) => {
    Post.findOne({
        _id: req.params.id
    }).then(
        (post) => {
            res.status(200).json(post);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

//*** Modification d'un POST ***//
exports.modifyPost = (req, res, next) => {
    const postId = req.params.id;
    console.log(req.body);
    if (req.file) {

        Post.findById(postId)// //--Récupération du post dans la base et vérification qu'il appartient bien à la personne qui effectue la requête delete et autorisation à l'administrateur
            .then((post) => {
//--Suppression de lancienne image dans le système de fichier
                const filename = post.imageUrl.split("/images/")[1]; //--Nom de l'ancien post
                const sentImageUrl = `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
            }`;
                console.log(sentImageUrl);
                fs.unlink(`images/${filename}`, () => { 
                    Post.updateOne({ //--Mise à jour de la post
                            _id: postId
                        }, {
                            ...JSON.parse(req.body.post),
                            _id: postId,
                            imageUrl: sentImageUrl,
                            date: new Date(Date.now()),
                        })
                        .then(() => res.status(200).json({
                            message: "objet modifié"
                        }))
                        .catch((err) => res.status(400).json(err));
                });
            })
            .catch((err) => res.status(500).json(err));
    } else {
        Post.updateOne({
                _id: postId
            }, {
                ...req.body,
                _id: postId,
            })
            .then(() => res.status(200).json({
                message: "objet modifié"
            }))
            .catch((err) => res.status(400).json(err));
    }
};

//**********Suppression d'un post
exports.deletePost = (req, res, next) => {
    Post.findOne({
            _id: req.params.id
        })
        .then(post => {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Publication supprimée !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

//**********Récupération de tous les posts
exports.getAllPosts = (req, res, next) => {
    Post.find().then(
        (posts) => {
            res.status(200).json(posts);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

//**********Likes
exports.likePost = (req, res, next) => {
    const {
        userId,
        isLiked
    } = req.body
    Post.findOne({
            _id: req.params.id
        })
        .then(post => {
            let newUsersLiked = post.usersLiked
            if (isLiked) {
                if (post.usersLiked.includes(userId)) {
                    newUsersLiked.splice(newUsersLiked.indexOf(userId), 1)
                } else {
                    newUsersLiked.push(userId);
                }
            }  else {
                if (post.usersLiked.includes(userId)) {
                    newUsersLiked.splice(newUsersLiked.indexOf(userId), 1)
                } 
            }
            Post.updateOne({
                    _id: req.params.id
                }, {
                    likes: newUsersLiked.length,
                    usersLiked: newUsersLiked,
                    isLiked: isLiked
                })
                .then(() => res.status(200).json({
                    message: 'Objet modifié !'
                }))
                .catch(error => res.status(400).json({
                    error
                }));


        })
};