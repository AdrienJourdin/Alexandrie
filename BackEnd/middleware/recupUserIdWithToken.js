const jwt = require('jsonwebtoken')

//Fonction qui recupère l'userid dans le token
exports.recupUserIdWithToken = (req) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, 'TOKEN_alexandrie_1870')
    const userId = decodedToken.userId

    return userId
}
