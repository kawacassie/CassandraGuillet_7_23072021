const express = require('express');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

// Base de données
const { sequelize } = require('./models/index');

// Connexion à la BDD
const databaseTest = async function () {
  try {
    await sequelize.authenticate(); 
    console.log('La connexion est établie avec succès');
  } catch (error) {
    console.error('Impossible de se connecter à la base de donnée', error);
  }
};
databaseTest();

const app = express();

// Ajoute extra headers pour protéger les routes
app.use(helmet());

// Headers pour éviter les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

module.exports = app;