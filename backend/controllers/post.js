const token = require('../middleware/token');
const database = require('../models');
const fs = require('fs');

// Récupérer toutes les posts enregistrés

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await database.Post.findAll({
      attributes: ["id", "title", "content", "image_url", "createdAt"],
      order: [["id", "DESC"]],
      include: [
        {
          model: database.User,
          attributes: ["id", "first_name", "last_name", "avatar"],
        },
        {
          model: database.Comment,
          attributes: ["id", "message", "UserId", "createdAt"],
          order: [["id", "ASC"]],
          include: [
            {
              model: database.User,
              attributes: ["first_name", "last_name", "avatar"],
            },
          ],
        },
      ],
    });
    res.status(200).send(posts);
  } catch(error) {
    return res.status(500).send({
      error: "Une erreur est survenue lors de la récupération des posts" + error
    });
  }
};

// Création d'un nouveau post
exports.createPost = async (req, res) => {
  const UserId = token.getUserId(req);
  let image_url = "";
  try {
    const user = await database.User.findOne({
      attributes: ["first_name", "last_name", "id", "avatar"],
      where: { id: UserId },
    });
    if (user !== null) {
      if(req.file) {
        image_url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      } else {
        image_url = null;
      }
      const post = await database.Post.create({
        include: [
          {
            model: database.User,
            attributes: ["first_name", "last_name", "avatar", "id"],
          },
        ],
        title: req.body.title,
        content: req.body.content,
        image_url: image_url,
        UserId: UserId,
      });
      res.status(201).json({ post: post, messageRetour: "Post enregistré" });
    } else {
      res.status(400).send({ error: "Erreur " + error});
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" + error });
  }
};

// Récupérer un post en particulier
exports.getOnePost = async (req, res) => {
  try {
    const post = await database.Post.findOne({
      where: { id: req.params.id }, 
      includes: [
        {
          model: database.User,
          attributes: ["first_name", "last_name", "avatar", "id"],
        },
        {
          model: database.Comment, 
          attributes: ["id", "message", "UserId", "createdAt"],
          order: [["id", "ASC"]],
          include: [
            {
              model: database.User,
              attributes: ["first_name", "last_name", "avatar"],
            },
          ],

        },
      ],
    });
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" + error });
  }
};

// Modification d'un post
exports.modifyPost = async (req, res) => {
  try {
    let newImage_url; 
    const userId = token.getUserId(req);
    let post = await database.Post.findOne({ where: { id: req.params.id }});
    if (userId === post.UserId) {
      if (req.file) {
        newImage_url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        if (post.image_url) {
          const filename = post.image_url.split('/images')[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) console.log(err);
            else {
              console.log(`Fichier supprimé : images/${filename}`);
            }
          });
        }
      }
      if (req.body.content) {
        post.content = req.body.content;
      }
      post.title = req.body.title;
      post.image_url = newImage_url;
      const newPost = await post.save({
        fields: ["title", "content", "image_url"]
      });
      res.status(200).json({ newPost: newPost, messageRetour: "Post modifié"});
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis"});
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" + error});
  }
};

// Suppression d'un post
exports.deletePost = async (req, res) => {
  try {
    const userId = token.getUserId(req);
    const checkAdmin = await database.User.findOne({ where: { id: userId }});
    const post = await database.Post.findOne({ where: {id: req.params.id }});
    if (userId === post.UserId || checkAdmin.is_admin === true) {
      if(post.image_url) {
        const filename = post.image_url.split('/images')[1];
        fs.unlink(`images/${filename}`, () => {
          database.Post.destroy({ where: {id: post.id }});
          res.status(200).json({ message: "Post supprimé"});
        });
      } else {
        database.Post.destroy({ where: { id: post.id }}, {truncate: true});
        res.status(200).json({ message : "Post supprimé" });
      }
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis"});
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" + error });
  }
};

// Ajout d'un commentaire
exports.addComment = async (req, res) => {
  try {
    const message = req.body.commentMessage;
    const newComment = await database.Comment.create({
      message: message,
      UserId: token.getUserId(req),
      PostId: req.params.id,
    });
    res.status(201).json({ newComment, messageRetour: "Commentaire ajouté" });
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" + error });
  }
};

// Suppression d'un commentaire
exports.deleteComment = async (req, res) => {
  try {
    const userId = token.getUserId(req);
    const checkAdmin = await database.User.findOne({ where: { id: userId }});
    const comment = await database.Comment.findOne({ where: { id: req.params.id }});
    if (userId === comment.UserId || checkAdmin.is_admin === true) {
      database.Comment.destroy({ where: { id: req.params.id }}, {truncate: true});
      res.status(200).json({ message: "Commentaire supprimé"});
    } else {
      res.status(400).json({message: "Vous n'avez pas les droits requis"});
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" + error });
  }
};