const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Création du compte utilisateur 
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Connexion au compte utilisateur 
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
      if(!user) {
          return res.status(404).json({ error: "Utilisateur non trouvé !" })
      }
      bcrypt.compare(req.body.password, user.password)
      .then(valid => {
          if(!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect !" })
          }
          res.status(200).json({
              message: "Utilisateur connecté !",
              userId: user.id,
              is_admin: user.is_admin,
              first_name : user.first_name,
              last_name: user.last_name,
              avatar : user.avatar,
              token: jwt.sign( { userId: user.id }, process.env.RND_TKN, { expiresIn: '24h' } )
          })
      })
      .catch(error => res.status(501).json({ error }))
  })
  .catch(error => res.status(502).json({ error }))
} 

// Récupérer tous les utilisateurs enregistrés
exports.getAllUsers = (req, res, next) => {
    User.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json({ error }));
  };

// Modification du compte utilisateur
exports.updateAccount = (req, res, next) => {
    const userObject = req.file ?
      {
        ...JSON.parse(req.body.user),
        avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    User.updateOne({ ...userObject, id: req.params.id }, { id: req.params.id })
      .then(() => res.status(200).json({ message: 'Compte utilisateur modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

// Récupérer un compte utilisateur en particulier
exports.getOneAccount = (req, res, next) => {
    User.findOne({ id: req.params.id })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).json({ error }));
  };

// Suppression d'un compte utilisateur
exports.deleteAccount = (req, res, next) => {
    User.findOne({ id: req.params.id })
      .then(user => {
        const filename = user.avatar.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          user.deleteOne({ where: { id: req.params.id }})
            .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };