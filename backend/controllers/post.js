const Post = require('../models/post');
const Comment = require('../models/comment');
const fs = require('fs');

// Récupérer toutes les posts enregistrés
exports.getAllPosts = (req, res, next) => {
    Post.find()
      .then(posts => res.status(200).json(posts))
      .catch(error => res.status(400).json({ error }));
};

// Création d'un nouveau post
exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post);
    delete postObject._id;
    const post = new Post({
      ...postObject,
      image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    post.save()
      .then(() => res.status(201).json({ message: 'Post enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

// Récupérer un post en particulier
exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
      .then(post => res.status(200).json(post))
      .catch(error => res.status(404).json({ error }));
};

// Modification d'un post
exports.modifyPost = (req, res, next) => {
    const postObject = req.file ?
      {
        ...JSON.parse(req.body.post),
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Post modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

// Suppression d'un post
exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
      .then(post => {
        const filename = post.image_url.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Post supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

// Afficher les likes et dislikes sur un post
exports.likeOrDislike = (req, res, next) => {
    if (req.body.like === 1) {
      Post.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++}, $push: { usersLiked: req.body.user_id } })
        .then((post) => res.status(200).json({ message : 'Like ajouté !'}))
        .catch(error => res.status(400).json({ error }))
    } else if (req.body.like === -1) {
      Post.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1}, $push: { usersDisliked : req.body.user_id } })
        .then((post) => res.status(200).json({ message: 'Dislike ajouté !'}))
        .catch(error => res.status(400).json({ error }))
    } else {
      Post.findOne({ _id: req.params.id })
        .then(post => {
          if (post.usersLiked.includes(req.body.user_id)) {
            Post.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.user_id }, $inc : { likes: -1 } })
              .then((post) => { res.status(200).json({ message: 'Like supprimé !'}) })
              .catch(error => res.status(400).json({ error }))
          } else if (post.usersDisliked.includes(req.body.user_id)) {
            Post.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.user_id }, $inc: { dislikes: -1 } })
              .then((post) => { res.status(200).json({ message: 'Dislike supprimé !'}) })
              .catch(error => res.status(400).json({ error }))
          }
        })
        .catch(error => res.status(400).json({ error }))
    }
}

// Ajout d'un commentaire
exports.addComment = (req, res, next) => {
    const commentObject = JSON.parse(req.body.sauce);
    delete commentObject._id;
    const comment = new Comment({
      ...commentObject,
    });
    comment.save()
      .then(() => res.status(201).json({ message: 'Commentaire ajouté !'}))
      .catch(error => res.status(400).json({ error }));
};

// Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    Comment.findOne({ _id: req.params.id })
      .then(comment => {
          Comment.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Commentaire supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        ;
      })
      .catch(error => res.status(500).json({ error }));
  };