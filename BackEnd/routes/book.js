const express = require('express');
const auth = require('../middleware/auth');

//Creation de la route
const router = express.Router();

//import des controllers
const bookCtrl = require('../controllers/book');

//Definition des routes pour les livres
router.post('/',auth, bookCtrl.create);
router.get('/:bookId', bookCtrl.getOne);


//Export des routes
module.exports = router;