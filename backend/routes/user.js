const express = require('express');
const router = express.Router();
const max = require('../middleware/rate-limiting');

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', userCtrl.signup);
router.post('/login', max.limiter, userCtrl.login);
router.get('/accounts', auth, userCtrl.getAllUsers);
router.put('/accounts', auth, multer, userCtrl.updateAccount);
router.get('/accounts/:id', auth, userCtrl.getOneAccount);
router.delete('/accounts/:id', auth, userCtrl.deleteAccount);

module.exports = router;
