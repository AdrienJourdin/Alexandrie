const env = require("../config/env.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models
db.user = require("./user")(sequelize, Sequelize);
db.book = require("./book")(sequelize, Sequelize);

//Définition des liaisons entre les tables


module.exports = db;