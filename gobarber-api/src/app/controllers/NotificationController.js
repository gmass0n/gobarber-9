// NOTIFICATION CONTROLLER

// IMPORTS
import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  // METODO DE LISTAGEM DE NOTIFICAÇÕES
  async index( req, res ) {
    const checkUserProvider = await User.findOne( {
      where: { id: req.userId, provider: true },
    } );

    // VERIFICANDO SE O USUÁRIO É UM PROVEDOR
    if ( !checkUserProvider ) {
      return res.status( 401 ).json( { error: 'Only providers can load notifications.' } );
    }

    // BUSCA AS NOTIFICAÇÕES E PARTIR DA DATA AS ORDENA DE FORMA DESCRESCENTE
    const notifications = await Notification.find( {
      user: req.userId,
    } ).sort( { createdAt: 'desc' } ).limit( 20 );

    // RETORNA AS NOTIFICAÇÕES
    return res.json( notifications );
  }

  // METODO DE ATUALIZAÇÃO DE NOTIFICAÇÕES
  async update( req, res ) {
    // BUSCA A NOTIFICAÇÃO E A ATUALIZA PARA LIDA
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    // RETORNA A NOTIFICAÇÃO COMO LIDA
    return res.json( notification );
  }
}

// EXPORT
export default new NotificationController();
