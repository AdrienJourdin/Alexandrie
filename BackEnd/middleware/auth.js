const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

//Middleware qui permet de vérifier si l'utilisateur du token
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "TOKEN_alexandrie_1870");
    const userId = decodedToken.userId;
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (user) {
        next();
      } else {
        res.status(400).send({ message: "Utilisateur inconnu" });
      }
    } catch {
      res
        .status(400)
        .send({ message: "Erreur lors de la recherche de l'utilisateur" });
    }
  } catch {
    res.status(401).send({
      message:"Impossible de vérifier le token",
    });
  }
};