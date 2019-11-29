/* eslint-disable no-shadow */
// CONEXAO COM O BANCO E MODELS

// IMPORTS
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

// MODELS DO APP
const models = [ User, File, Appointment ];

class Database {
  // PRIMEIRO METODO A SER EXECUTADO
  constructor() {
    this.init();
    this.mongo();
  }

  // FAZ A CONEXAO COM A BASE DE DADOS E CARREGA OS MODELS
  init() {
    // CONEXÃO COM A BASE DE DADOS
    this.connection = new Sequelize( databaseConfig );

    // PASSA A CONEXÃO PARA CADA MODEL
    models.map( ( model ) => model.init( this.connection ) );

    models.map( ( model ) => model.associate && model.associate( this.connection.models ) );
  }

  // FAZ A CONEXÃO COM O MONGODB
  mongo() {
    this.mongoConnection = mongoose.connect( process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    } );
  }
}

// EXPORT
export default new Database();
