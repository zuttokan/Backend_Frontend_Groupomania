const Post = require('../models/post');
const fs = require('fs');
const auth = require('../middleware/auth');

// Created Post
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  const post = new Post({
    ...postObject,
    likes: 0,
    usersLiked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    date: new Date(Date.now()),
  });

  post
    .save()
    .then(() =>
      res.status(201).json({
        message: 'Post Created !!',
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

// Get a Post
exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Update a Post
exports.modifyPost = (req, res, next) => {
  const postId = req.params.id;
  //console.log(req.body);
  if (req.file) {
    Post.findById(
      postId
    ) /* Retrieving post in the database and checking and user */
      .then((post) => {
        /* Suppress old file */
        const filename = post.imageUrl.split('/images/')[1];
        const sentImageUrl = `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`;
        fs.unlink(`images/${filename}`, () => {
          //console.log(JSON.parse(req.body.post));

          const Obj = JSON.parse(req.body.post); /*Safety connection*/
          const desc = Obj.description; /*Safety connection*/
          const AuthId = Obj.userId; /*Safety connection*/

          //console.log(desc);
          //console.log(AuthId);
          //console.log(req.auth);

          if (req.auth.isAdmin || req.auth.userId == AuthId) {
            /*Safety connection*/
            Post.updateOne(
              /* post Updated */
              {
                _id: postId,
              },
              {
                description: desc,
                userId: AuthId,
                imageUrl: sentImageUrl,
                date: new Date(Date.now()),
              }
            )
              .then(() =>
                res.status(200).json({
                  message: 'Picture updated',
                })
              )
              .catch((err) => res.status(400).json(err));
          }
        });
      })
      .catch((err) => res.status(500).json(err));
  } else {
    //console.log(req.body);
    const Obj = req.body;
    const desc = Obj.description;
    const AuthId = Obj.userId;
    if (req.auth.isAdmin || req.auth.userId == AuthId) {
      Post.updateOne(
        {
          _id: postId,
        },
        {
          description: desc,
          userId: AuthId,
        }
      )
        .then(() =>
          res.status(200).json({
            message: 'text updated',
          })
        )
        .catch((err) => res.status(400).json(err));
    }
  }
};

// Delete a Post
exports.deletePost = (req, res, next) => {
  const Obj = req.body;
  const desc = Obj.description;
  const AuthId = Obj.userId;
  if (req.auth.isAdmin || req.auth.userId == AuthId) {
  }
  Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
      const filename = post.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.deleteOne({
          _id: req.params.id,
        })
          .then(() =>
            res.status(200).json({
              message: 'Post deleted !',
            })
          )
          .catch((error) =>
            res.status(400).json({
              error,
            })
          );
      });
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};

// Get all Post
exports.getAllPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Liked a Post
exports.likePost = (req, res, next) => {
  const { userId, isLiked } = req.body;
  Post.findOne({
    _id: req.params.id,
  }).then((post) => {
    let newUsersLiked = post.usersLiked;
    if (isLiked) {
      if (post.usersLiked.includes(userId)) {
        newUsersLiked.splice(
          newUsersLiked.indexOf(userId),
          1
        ); /* The splice() method modifies the contents of an array by removing elements or adding */
      } else {
        newUsersLiked.push(userId);
      }
    } else {
      if (post.usersLiked.includes(userId)) {
        newUsersLiked.splice(newUsersLiked.indexOf(userId), 1);
      }
    }
    Post.updateOne(
      {
        _id: req.params.id,
      },
      {
        likes: newUsersLiked.length,
        usersLiked: newUsersLiked,
        isLiked: isLiked,
      }
    )
      .then(() =>
        res.status(200).json({
          message: 'Like updated !',
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  });
};
