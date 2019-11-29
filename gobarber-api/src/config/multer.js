// UPLOAD CONFIGS

// IMPORTS
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // DEFINE COMO IRA SALVAR OS UPLOADS
  storage: multer.diskStorage( {
    // DESTINO DO ARQUIVO
    destination: resolve( __dirname, '..', '..', 'tmp', 'uploads' ),
    // NOME DO ARQUIVO
    filename: ( req, file, cb ) => {
      crypto.randomBytes( 16, ( err, res ) => {
        // CASO DER ERRO RETORNA O ERRO
        if ( err ) return cb( err );

        // RETORNA O NOME DO ARQUIVO
        return cb( null, res.toString( 'hex' ) + extname( file.originalname ) );
      } );
    },
  } ),
};
