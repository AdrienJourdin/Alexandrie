const db = require('../models')
const Book = db.book
const User = db.user
const recupUserId = require('../middleware/recupUserIdWithToken')

exports.create = async (req, res) => {
    const bookObject = req.body
    const nom_fichier_post = req.file
        ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        : ''
    Book.create({
        name: bookObject.name,
        author: bookObject.author,
        publisher: bookObject.publisher,
        photo: nom_fichier_post,
        numberOfPages: bookObject.numberOfPages,
        genre: bookObject.genre,
        rating: null,
        date: bookObject.date,
    })
        .then((post) => {
            res.status(200).send({
                post,
                message: 'Votre livre a bien été ajouté',
            })
        })
        .catch((error) =>
            res.status(400).send({
                message: 'Erreur lors de la création de votre livre',
                error,
            })
        )
}

exports.getOne = (req, res) => {
    Book.findOne({
        where: { id: req.params.bookId },
    })
        .then((book) => {
            if (!book) {
                return res
                    .status(401)
                    .send({ error, message: 'Livre introuvable' })
            } else {
                res.status(200).send({ book })
            }
        })
        .catch((error) =>
            res.status(401).send({
                error,
                message: 'Erreur lors de la recherche du livre',
            })
        )
}

exports.getAll = (req, res) => {
    Book.findAll({
        order: [['createdAt', 'DESC']],
    })
        .then((books) => {
            res.status(200).send(books)
        })
        .catch((error) =>
            res.status(400).send({
                error,
                message: 'Erreur lors du chargement des livres',
            })
        )
}

exports.update = (req, res) => {
    const bookId = req.params.bookId
    const book = req.body

    if (req.file) {
        Book.update(
            {
                ...book,
                photo: `${req.protocol}://${req.get('host')}/images/${
                    req.file.filename
                }`,
            },

            { where: { id: bookId } }
        )
            .then(() => {
                res.status(200).json({
                    status: true,
                    message: 'Mise a jour du livre id = ' + bookId,
                })
            })
            .catch((error) =>
                res.status(500).send({
                    message:
                        'Erreur lors de la mise à jour u livre id=' + bookId,
                    error,
                })
            )
    } else {
        Book.update(
            {
                ...book,
            },
            { where: { id: bookId } }
        )
            .then(() => {
                res.status(200).json({
                    status: true,
                    message: 'Mise a jour du livre id = ' + bookId,
                })
            })
            .catch((error) =>
                res.status(500).send({
                    message:
                        'Erreur lors de la mise à jour du livre id=' + bookId,
                    error,
                })
            )
    }
}

exports.delete = (req, res) => {
    const bookId = req.params.bookId
    Book.destroy({ where: { id: req.params.bookId } })
        .then((book) => {
            if (!book) {
                return res
                    .status(400)
                    .send({ message: 'Livre id=' + bookId + ' introuvable' })
            } else {
                res.status(200).send({
                    status: true,
                    message: 'Suppression du livre id = ' + bookId,
                })
            }
        })
        .catch((error) =>
            res.status(500).send({
                message: 'Erreur lors de la suppression du livre id=' + bookId,
                error,
            })
        )
}

exports.rateBook = (req, res) => {
    const userId = recupUserId.recupUserIdWithToken(req).toString()
    const bookId = req.params.bookId
    const rate = req.body.rate

    const bookNRate = {
        rate: rate,
        bookId: bookId,
    }

    const userNRate = {
        rate: rate,
        userId: userId,
    }

    //Ajout du livre dans la liste de l'utilisateur
    User.findOne({ where: { id: userId } })
        .then((user) => {
            let booksReadList = user.booksRead ? user.booksRead : []
            console.log(bookNRate)
            let indexToDelete = 0
            if (rate == -1) {
                for (let n = 0; n < booksReadList.length; n++) {
                    if (booksReadList[n].bookId == bookNRate.bookId) {
                        indexToDelete = n
                        bookIsHere = true
                    }
                }
                booksReadList.splice(indexToDelete, 1)
            } else {
                bookIsHere = false
                for (let n = 0; n < booksReadList.length; n++) {
                    if (booksReadList[n].bookId == bookNRate.bookId) {
                        booksReadList[n] = bookNRate
                        bookIsHere = true
                    }
                }
                console.log(booksReadList)
                if (!bookIsHere) {
                    booksReadList.push(bookNRate)
                }
            }
            User.update({ booksRead: booksReadList }, { where: { id: userId } })
                .then(() => {
                    Book.findOne({ where: { id: bookId } })
                        .then((book) => {
                            let bookListOfRating = book.rating
                                ? book.rating
                                : []
                            userIsHere = false
                            let indexToDelete = 0
                            if (rate == -1) {
                                for (
                                    let n = 0;
                                    n < bookListOfRating.length;
                                    n++
                                ) {
                                    if (
                                        bookListOfRating[n].userId ==
                                        bookListOfRating.userId
                                    ) {
                                        indexToDelete = n
                                        bookIsHere = true
                                    }
                                }
                                bookListOfRating.splice(indexToDelete, 1)
                            } else {
                                for (
                                    let n = 0;
                                    n < bookListOfRating.length;
                                    n++
                                ) {
                                    if (
                                        bookListOfRating[n].userId ==
                                        userNRate.userId
                                    ) {
                                        bookListOfRating[n] = userNRate
                                        userIsHere = true
                                    }
                                }

                                if (!userIsHere) {
                                    bookListOfRating.push(userNRate)
                                }
                            }
                            Book.update(
                                { rating: bookListOfRating },
                                { where: { id: bookId } }
                            ).then(() => {
                                res.status(200).send({
                                    message:
                                        'Votre note a bien été modifiée dans la table des livres',
                                })
                            })
                        })
                        .catch((error) => {
                            res.status(401).send({
                                error,
                                message:
                                    'erreur lors de la modification de la note dans la table des livres',
                            })
                        })
                })
                .catch((error) => {
                    res.status(401).send({
                        error,
                        message:
                            'erreur lors de la modification de la note dans le profil utilisateur',
                    })
                })
        })
        .catch((error) => {
            res.status(401).send({
                error,
                message: 'erreur lors de la recherche du profil',
            })
        })
}
