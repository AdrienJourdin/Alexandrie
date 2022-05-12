const express = require('express');
const userRoutes = require('./routes/user');
const bookRoutes=require('./routes/book')
const db = require("./models");
bodyParser = require('body-parser');
//Création de l'app
const app = express();

//Paramétrage de l'acces à l'API, origine, headers, methodes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());
  app.use('/api/user', userRoutes);
  app.use('/api/book',bookRoutes);


  db.sequelize.sync({alter: true});

//Export de l'app  
module.exports = app;