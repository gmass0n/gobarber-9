/* eslint-disable max-len */
/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */

// MIDDLEWARE DE AUTENTICAÇÃO

// IMPORT
import jwt from 'jsonwebtoken';

import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async ( req, res, next ) => {
  // RECEBENDO O TOKEN DO USUÁRIO PELO HEADER
  const authHeader = req.headers.authorization;

  // VERIFICAÇÃO PARA CASO NAO EXISTIR O TOKEN
  if ( !authHeader ) {
    return res.status( 401 ).json( { error: 'Token not provided' } );
  }

  // DIVIDE O TOKEN INTEIRO PELOS ESPAÇOS, SALVANDO SOMENTE O TOKEN
  const [ , token ] = authHeader.split( ' ' );

  try {
    // PEGA AS INFORMAÇOES DO TOKEN (id)
    const decoded = await promisify( jwt.verify )( token, authConfig.secret );

    // ARMAZENA NO ID DO USUÁRIO NA REQUISIÇÃO, PORTANTO TODAS AS ROTAS QUE USAR ESSE MIDDLEWARE TERÁ ACESSO
    req.userId = decoded.id;

    // FAZ COM QUE A ROTA NÃO PARE
    return next();
  } catch ( err ) {
    // RETORNA UM ERRO CASO O TOKEN FOR INVALIDO
    return res.status( 401 ).json( { error: 'Token invalid' } );
  }
};
