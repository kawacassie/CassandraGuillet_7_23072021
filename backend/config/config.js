const database = require('../models');
const bcrypt = require('bcrypt'); 

// Création du compte administrateur 

function createAdmin(req, res) {
    database.User.findOne({ where: { email: 'admin@mail.com' } || { first_name : 'admin'} })
        .then((user) => {
            if (!user) {
                bcrypt
                    .hash('Moderateur', 10)
                    .then((hash) => {
                        const admin = database.User.create({
                            first_name: 'Admin',
                            last_name: 'Is admin',
                            email: 'admin@mail.com',
                            password: hash, 
                            is_admin: true,
                        })
                            .then((admin) => {
                                console.log({
                                    admin, 
                                    message: 'Votre compte admin a bien été créé',
                                });
                            })
                            .catch((error) => {
                                res.status(400).json({ error });
                            });
                    })
                    .catch((error) => {
                        res.status(500).send({ error });
                    });
            } else {
                console.log({ message: 'L\'admin existe déjà' });
            }
        })
        .catch((error) => {
            console.log({ error });
        });
}

module.exports = createAdmin();

module.exports = {
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret',
    },
};