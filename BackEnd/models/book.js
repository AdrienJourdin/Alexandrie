module.exports = (sequelize, Sequelize) => {

    const Book= sequelize.define("book",
      {
        name: {
          type: Sequelize.STRING,
        },
        author: {
          type: Sequelize.STRING,
        },
        publisher: {
          type: Sequelize.STRING,
        },
        date: {
          type: Sequelize.INTEGER,
        },
        numberOfPages:{
            type: Sequelize.INTEGER,
        },
        rating:{
            type: Sequelize.INTEGER,
        },
        genre:{
            type: Sequelize.STRING,
        },
        photo:{
            type: Sequelize.STRING
        }
      }
    );
    return Book ;
  };