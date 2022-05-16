const express = require('express')
const auth = require('../middleware/auth')

//Creation de la route
const router = express.Router()

//import des controllers
const bookCtrl = require('../controllers/book')

//Definition des routes pour les livres
router.post('/', auth, bookCtrl.create)
router.get('/:bookId', auth, bookCtrl.getOne)
router.put('/:bookId', auth, bookCtrl.update)
router.delete('/:bookId', auth, bookCtrl.delete)
router.put('/rate/:bookId', auth, bookCtrl.rateBook)
//Export des routes
module.exports = router
