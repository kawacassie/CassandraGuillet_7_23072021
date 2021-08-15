const bcrypt = require('bcrypt');
const database = require('../models');
const token = require('../middleware/token');
const fs = require('fs');
const { Op } = require("sequelize");


//Création du compte utilisateur 
exports.signup = async (req, res) => {
  try {
    const user = await database.User.findOne({
      where: { email: req.body.email },
    });
    if (user !== null) {
      if (user.first_name === req.body.first_name && user.last_name === req.body.last_name) {
        return res.status(400).json({ error: "Ce nom est déjà utilisé" + error });
      }
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = await database.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash, 
        is_admin: false,
      });

      const tokenObject = await token.issueJWT(newUser);
      res.status(201).send({
        user: newUser, 
        token: tokenObject.token, 
        expires: tokenObject.expiresIn,
        message: 'Utilisateur créé !',
      });
    }
  } catch (error) {
    return res.status(400).send({ error: 'Email déjà utilisé' + error });
  }
};

//Connexion au compte utilisateur 
exports.login = async (req, res) => {
  try {
    const user = await database.User.findOne({
      where: { email: req.body.email },
    });
    if (user === null) {
      return res.status(403).send({ error: 'Connexion échouée' });
    } else {
      const hash = await bcrypt.compare(req.body.password, user.password);
      if (!hash) {
        return res.status(401).send({ error: 'Mot de passe incorrect'});
      } else {
        const tokenObject = await token.issueJWT(user);
        res.status(200).send({
          user: user,
          token: tokenObject.token,
          sub: tokenObject.sub,
          expires: tokenObject.expiresIn,
          message: "Bonjour " + user.first_name + " !",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" + error });
  }
};

// Récupérer tous les utilisateurs enregistrés
exports.getAllUsers = async (req, res) => {
  try {
    const users = await database.User.findAll({
      attributes: ['first_name', 'last_name', 'id', 'avatar', 'bio', 'email'],
      where: { id: { [Op.ne] : 1, } }
    });
    res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

// Modification du compte utilisateur 
exports.updateAccount = async (req, res) => {
  const id = req.params.id;
  try {
    const userId = token.getUserId(req);
    let newAvatar;
    let user = await database.User.findOne({ where: { id: id }});
    if (userId === user.id) {
      if (req.file && user.avatar) {
        newAvatar = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        const filename = user.avatar.split('/images')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) console.log(err);
          else {
            console.log(`Deleted file: images/${filename}`);
          }
        });
      } else if (req.file) {
        newAvatar = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      }
      if (newAvatar) {
        user.avatar = newAvatar;
      }
      if (req.body.bio) {
        user.bio = req.body.bio;
      }
      if (req.body.first_name) {
        user.first_name = req.body.first_name;
      }
      if (req.body.last_name) {
        user.last_name = req.body.last_name;
      }
      const newUser = await user.save({ fields: ["first_name", "last_name", "bio", "avatar"]});
      res.status(200).json({
        user: newUser,
        messageRetour: "Votre profil a bien été modifié",
      });
    } else {
      res.status(400).json({ messageRetour: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

// Récupérer un compte utilisateur en particulier
exports.getOneAccount = async (req, res) => {
  try {
    const user = await database.User.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

// Suppression d'un compte utilisateur
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await database.User.findOne({ where: { id: id }});
    if (user.avatar !== null) {
      const filename = user.avatar.split('/images')[1];
      fs.unlink(`images/${filename}`, () => {
        database.User.destroy({ where: { id: id } });
        res.status(200).json({ messageRetour: "Utilisateur supprimé" });
      });
    } else {
      database.User.destroy({ where: { id: id } });
      res.status(200).json({ messageRetour: "Utilisateur supprimé" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};