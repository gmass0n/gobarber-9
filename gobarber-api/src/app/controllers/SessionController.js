// CONTROLLER DA SESSÃO

// IMPORT
import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';

import authConfig from '../../config/auth';

class SessionController {
  // CRIAÇÃO DE SESSÃO
  async store( req, res ) {
    // FORMATO E REGRA DA VALIDAÇÃO
    const storeSchema = Yup.object().shape( {
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    } );

    // VERIFICAÇÃO PARA SABER SE O 'req.body' ESTA DE ACORDO COM A VALIDAÇÃO CRIADA
    if ( !( await storeSchema.isValid( req.body ) ) ) {
      return res.status( 400 ).json( { error: 'Validation fails.' } );
    }

    // ARMAZENANDO O EMAIL E A SENHA RECEBIDO PELO BODY REQUEST
    const { email, password } = req.body;

    // PROCURA O USUÁRIO PELO SEU EMAIL
    const user = await User.findOne( {
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: [ 'id', 'path', 'url' ],
        },
      ],
    } );

    // VERIFICAÇÃO PARA CASO O EMAIL NAO EXISTA
    if ( !user ) {
      return res.status( 401 ).json( { error: 'Email not found.' } );
    }

    // VERIFICAÇÃO PARA CASO A SENHA NAO CORRESPONDE COM A SENHA CRIADA
    if ( !( await user.checkPassword( password ) ) ) {
      return res.status( 401 ).json( { error: 'Password does not match.' } );
    }

    // ARMAZENA APENAS O 'id e name' DO USUÁRIO APOS O LOGIN
    const {
      id, name, avatar, provider,
    } = user;

    // RETORNA AS INFORMAÇÕES DO USUÁRIO LOGADO
    return res.json( {
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      // TOKEN JWT
      token: jwt.sign(
        // PAYLOAD (INFORMAÇÕES ADICIONAIS)
        {
          id,
        },
        // TEXTO SECRETO DO TOKEN
        authConfig.secret,
        // CONFIGURAÇÕES DO TOKEN
        {
          // DATA DE EXPIRAÇÃO
          expiresIn: authConfig.expiresIn,
        },
      ),
    } );
  }
}

// EXPORT
export default new SessionController();
