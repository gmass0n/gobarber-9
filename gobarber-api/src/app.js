// ESTRUTURA DA APLICAÇÃO

// IMPORTS
import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';
import './database';

class App {
  // METODO EXECUTADO APENAS UMA VEZ QUANDO A CLASSE FOR CHAMADA
  constructor() {
    this.server = express();

    // INICIALIZANDO O SENTRY
    Sentry.init( sentryConfig );

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  // TODOS OS MIDDLEWARES DO APP
  middlewares() {
    this.server.use( Sentry.Handlers.requestHandler() );

    this.server.use( cors() );

    // FAZ COM QUE O APP ENTENDA O FORMATO JSON
    this.server.use( express.json() );

    // FAZ COM QUE A ROTA '/files' CONSIGA ACESSAR ARQUIVOS DAS PASTA UPLOADS
    this.server.use( '/files', express.static( path.resolve( __dirname, '..', 'tmp', 'uploads' ) ) );
  }

  // TODAS AS ROTAS DO APP
  routes() {
    this.server.use( routes );
    this.server.use( Sentry.Handlers.errorHandler() );
  }

  // MIDDLEWARE DE TRATAMENTO DE EXCEÇÕES
  exceptionHandler() {
    this.server.use( async ( err, req, res, next ) => {
      if ( process.env.NODE_ENV === 'development' ) {
        const errors = await new Youch( err, req ).toJSON();

        return res.status( 500 ).json( errors );
      }
      return res.status( 500 ).json( { error: 'Internal server error' } );
    } );
  }
}

// EXPORT
export default new App().server;
