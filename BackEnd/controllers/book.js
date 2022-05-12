const db = require("../models");
const Book = db.book;

exports.create = async (req, res) => {
    const bookObject = req.body;
    const nom_fichier_post = req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : "";
    Book.create({
        name: bookObject.name,
        author: bookObject.author,
        publisher: bookObject.publisher,
        photo: nom_fichier_post,
        numberOfPages:bookObject.numberOfPages,
        genre:bookObject.genre,
        rating:null,
        date:bookObject.date,
    })
      .then((post) => {
        res.status(200).send({
          post,
          message: "Votre livre a bien été ajouté",
        });
      })
      .catch((error) =>
        res
          .status(400)
          .send({ message: "Erreur lors de la création de votre livre", error })
      );
  };


exports.getOne = (req, res) => {
    Book.findOne({
      where: { id: req.params.bookId },
    })
      .then((book) => {
        if (!book) {
          return res
            .status(401)
            .send({ error, message: "Livre introuvable" });
        } else {
          res.status(200).send({ book });
        }
      })
      .catch((error) =>
        res.status(401).send({
          error,
          message: "Erreur lors de la recherche du livre",
        })
      );
  };


  exports.getAll = (req, res) => {
    Book.findAll({
      order: [["createdAt", "DESC"]],
    })
      .then((books) => {
        res.status(200).send(books);
      })
      .catch((error) =>
        res
          .status(400)
          .send({ error, message: "Erreur lors du chargement des livres" })
      );
  };

  exports.update = (req, res) => {
    const bookId = req.params.bookId;
    const book = req.body;
    const nom_fichier_book = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : "";
    if(req.file){
    Book.update(
      {
        name: book.name,
        author: book.author,
        publisher: book.publisher,
        photo: nom_fichier_book,
        numberOfPages:book.numberOfPages,
        genre:bookObject.genre,
        rating:null,
        date:bookObject.date,
        },
      
      { where: { id: postId } }
    )
      .then(() => {
        res.status(200).json({
          status: true,
          message: "Mise a jour de la publication id = " + postId,
        });
      })
      .catch((error) =>
        res.status(500).send({
          message: "Erreur lors de la mise à jour de la publication id=" + postId,
          error,
        })
      );
    }else{
      Post.update(
        {
          content: content,
        },
        { where: { id: postId } }
      )
        .then(() => {
          res.status(200).json({
            status: true,
            message: "Mise a jour de la publication id = " + postId,
          });
        })
        .catch((error) =>
          res.status(500).send({
            message: "Erreur lors de la mise à jour de la publication id=" + postId,
            error,
          })
        );
    }
  };