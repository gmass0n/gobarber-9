// CONTROLLER DE USUÁRIOS

// IMPORT
import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';

class UserController {
  // CRIAÇÃO DE USUÁRIO
  async store( req, res ) {
    // FORMATO DA VALIDAÇÃO E REGRA
    const storeSchema = Yup.object().shape( {
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min( 6 ),
    } );

    // VERIFICAÇÃO PARA SABER SE O 'req.body' ESTA DE ACORDO COM A VALIDAÇÃO CRIADA
    if ( !( await storeSchema.isValid( req.body ) ) ) {
      return res.status( 400 ).json( { error: 'Validation fails.' } );
    }

    // VERIFCAÇÃO PARA SABER SE O USUÁRIO JA EXISTE
    const userExists = await User.findOne( { where: { email: req.body.email } } );

    if ( userExists ) {
      return res.status( 400 ).json( { email: 'User alredy exists.' } );
    }

    // CRIA O USUÁRIO A PARTIR DAS INFORMAÇÕES RECEBIDA PELO BODDY
    const {
      id,
      name,
      email,
      provider,
    } = await User.create( req.body );

    // MOSTRA O ID, NOME, EMAIL E PROVIDER DO USUÁRIO EM FORMATO JSON
    return res.json( {
      id,
      name,
      email,
      provider,
    } );
  }

  // ALTERAÇÃO DE DADOS DO USUÁRIO
  async update( req, res ) {
    // FORMATO DA VALIDAÇÃO E REGRA
    const updateSchema = Yup.object().shape( {
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min( 6 ),
      password: Yup.string().min( 6 ).when(
        'oldPassword', ( oldPassword, field ) => ( oldPassword ? field.required() : field ),
      ),
      // FAZENDO COM QUE TENHA UMA CONFIRMAÇÃO DE SENHA
      confirmPassword: Yup.string().when(
        'password', ( password, field ) => ( password ? field.required().oneOf( [ Yup.ref( 'password' ) ] ) : field ),
      ),
    } );

    // VERIFICAÇÃO PARA SABER SE O 'req.body' ESTA DE ACORDO COM A VALIDAÇÃO CRIADA
    if ( !( await updateSchema.isValid( req.body ) ) ) {
      return res.status( 400 ).json( { error: 'Validation fails.' } );
    }

    // ARMAZENA O 'email' E O 'oldPassoword' RECEBIDO PELO BODY REQUEST
    const { email, oldPassword } = req.body;

    // BUSCA O USUÁRIO NO BANCO DE DADOS PELO SEU ID
    const user = await User.findByPk( req.userId );

    // VERIFICAÇÃO PARA CASO FOR ATUALIZAR O EMAIL
    if ( email !== user.email ) {
      const userExists = await User.findOne( { where: { email } } );

      if ( userExists ) {
        return res.status( 400 ).json( { error: 'User alredy exists.' } );
      }
    }

    // VERIFICAÇÃO PARA CASO ELE FOR ATUALIZAR A SENHA
    if ( oldPassword && !( await user.checkPassword( oldPassword ) ) ) {
      return res.status( 401 ).json( { error: 'Password does not match.' } );
    }

    // RECEBE AS INFORMAÇÕES PELO BODY REQUEST E ATUALIZA O USUÁRIO PELO MÉTODO UPDATE
    await user.update( req.body );

    const {
      id, name, avatar,
    } = await User.findByPk( req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: [ 'id', 'path', 'url' ],
        },
      ],
    } );

    // RETORNA ALGUMAS INFORMAÇÕES ATUALIZADAS DO USUÁRIO
    return res.json( {
      id,
      name,
      email,
      avatar,
    } );
  }
}

// EXPORT
export default new UserController();
