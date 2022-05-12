
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;


exports.signup = (req, res) => {
    console.log(req.body);
    console.log(req.body.user);
  const userObject = req.body;
  //Hashage du mot de passe
  bcrypt.hash(userObject.password, 10).then((hash) => {
    // Sauvegarde de l'user dans ma database


    User.create({
      lastName: userObject.lastName,
      firstName: userObject.firstName,
      password: hash,
      email: userObject.email,
      pseudo:userObject.pseudo,
      bookRead:{},
      bookWishList:{}
      }
    )
      .then((user) => {
        res.status(200).send({
          status: true,
          message: "user created successfully",
        });
      })
      .catch((error) =>
        res
          .status(500)
          .send({ error, message: "Erreur lors du hashage du mot de passe" })
      );
  });
};

exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(401).send({
          error: "Utilisateur email=" + req.body.email + " introuvable",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).send({ error: "Mot de passe incorrect" });
          }
          res.status(200).send({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, "TOKEN_alexandrie_1870", {
              expiresIn: "24h",
            }),
            role: user.role,
          });
        })
        .catch((error) =>
          res.status(500).send({
            error,
            message: "erreur lors de la vérification du mot de passe",
          })
        );
    })
    .catch((error) =>
      res.status(401).send({
        error,
        message: "Erreur lors de la recherche de l'utilisateur ",
      })
    );
};

exports.delete = (req, res) => {
  const userId = req.params.userId;

  User.destroy({ where: { id: userId } })
    .then(() => {
      res.status(200).send({
        status: true,
        message: "User deleted successfully with id = " + userId,
      });
    })
    .catch((error) =>
      res.status(500).send({
        message: "erreur lors de la suppression de l'utilisateur id=" + userId,
      })
    );
};

exports.update = (req, res) => {
  const userId = req.params.userId;
  const userObject = JSON.parse(req.body.user);
  bcrypt
    .hash(userObject.password, 10)
    .then((hash) => {

      User.update(
        {
            lastName: userObject.lastName,
            firstName: userObject.firstName,
            password: hash,
            email: userObject.email,
            pseudo:userObject.pseudo
        },
        { where: { id: userId } }
      )
        .then(() => {
          res.status(200).json({
            status: true,
            message: "User updated successfully with id = " + userId,
          });
        })
        .catch((error) =>
          res.status(500).send({
            message:
              "erreur lors de la mise à jour des infos du user id=" + userId,
          })
        );
    })
    .catch((error) =>
      res.status(500).send({ message: "Erreur lors du cryptage du mdp" })
    );
};

exports.getOne = (req, res) => {
  const userId = req.params.userId;
  User.findOne({
    where: { id: userId },
    attributes: ["id", "lastName", "firstName", "email",'pseudo','booksRead','BooksWishList'],
    
  })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ error: "Utilisateur id=" + userId + " introuvable" });
      }
      res.status(200).send({ user });
    })
    .catch((error) => res.status(401).send({ error }));
};

exports.getAll = (req, res) => {
  User.findAll({
    attributes: ["id", "lastName", "firstName", "email",'pseudo','booksRead','BooksWishList'],
  })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => res.status(401).send({ error }));
};