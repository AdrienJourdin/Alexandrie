const express = require('express')
const auth = require('../middleware/auth')
//Creation de la route
const router = express.Router()

//import des controllers
const userCtrl = require('../controllers/user')

//Definition des routes
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.delete('/:userId', userCtrl.delete)
router.put('/:userId', userCtrl.update)
router.get('/:userId', userCtrl.getOne)
router.get('/', userCtrl.getAll)
router.put('/addToWishList/:bookId', auth, userCtrl.addToWishList)

//Export des routes
module.exports = router
