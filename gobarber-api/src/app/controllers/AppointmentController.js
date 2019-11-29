// APPOINTMENT CONTROLLER

// IMPORTS
import * as Yup from 'yup';
import {
  startOfHour, parseISO, isBefore, format, subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  // MÉTODO DE LISTAGEM DE AGENDAMENTOS
  async index( req, res ) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll( {
      where: { user_id: req.userId, canceled_at: null },
      order: [
        'date',
      ],
      // FILTRANDO OQUE VAI APARECER NA LISTAGEM
      attributes: [ 'id', 'date', 'past', 'cancelable' ],
      limit: 20,
      offset: ( page - 1 ) * 20,
      include: [ {
        model: User,
        as: 'provider',
        attributes: [ 'id', 'name' ],
        include: [ {
          model: File,
          as: 'avatar',
          attributes: [ 'id', 'path', 'url' ],
        } ],
      } ],
    } );

    // RETORNANDO A LISTAGEM
    return res.json( appointments );
  }

  // MÉTODO DE CRIAÇÃO DE AGENDAMENTO
  async store( req, res ) {
    // FORMATO E REGRA DA VALIDAÇÃO
    const schema = Yup.object().shape( {
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    } );

    // VERIFICAÇÃO PARA SABER SE O 'req.body' ESTA DE ACORDO COM A VALIDAÇÃO CRIADA
    if ( !( await schema.isValid( req.body ) ) ) {
      return res.status( 400 ).json( { error: 'Validation fails.' } );
    }

    // BUSCA 'provider_id' E 'date' DO BODY REQUEST
    const { provider_id, date } = req.body;

    // VERIFICA SE O 'provider_id' É UM PRESTADOR DE SERVIÇOS
    const isProvider = await User.findOne( {
      where: { id: provider_id, provider: true },
    } );

    if ( !isProvider ) {
      return res.status( 401 ).json( { error: 'You can only create appointments with providers.' } );
    }

    // VERIFICA SE NÃO É UMA DATA PASSADA
    const hourStart = startOfHour( parseISO( date ) );

    if ( isBefore( hourStart, new Date() ) ) {
      return res.status( 400 ).json( { error: 'Past dates are not permited.' } );
    }

    // VERIFICA SE O PRESTADOR TEM HORARIO DISPONIVEL
    const checkAvailability = await Appointment.findOne( {
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    } );

    if ( checkAvailability ) {
      return res.status( 400 ).json( { error: 'Appointment date is not avaialable.' } );
    }

    // CRIANDO O AGENDAMENTO NO BANCO DE DADOS
    const appointments = await Appointment.create( {
      user_id: req.userId,
      provider_id,
      date,
    } );

    // ARMAZENANDO OS DADOS DO USUÁRIO PELO SEU ID
    const user = await User.findByPk( req.userId );

    // FORMATANDO O HORÁRIO QUE IRÁ APARECER NA NOTIFICAÇÃO
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', ás' H:mm'h'",
      { locale: pt },
    );

    // NOTIFIAR PRESTADOR DE SERVIÇOS
    await Notification.create( {
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    } );

    // RETORNANDO AS INFORMAÇÕES DO AGENDAMENTO
    return res.json( appointments );
  }

  // MÉTODO DE CANCELAMENTO DE AGENDAMENTO
  async delete( req, res ) {
    // BUSCA AS INFORMAÇOES DO AGENDAMENTO
    const appointment = await Appointment.findByPk( req.params.id, {
      include: [ {
        model: User,
        as: 'provider',
        attributes: [ 'name', 'email' ],
      }, {
        model: User,
        as: 'user',
        attributes: [ 'name' ],
      } ],
    } );

    // VERIFICAÇÃO PARA SABER SE QUEM ESTÁ REALIZANDO O CANCELAMENTO É O DONO
    if ( appointment.user_id !== req.userId ) {
      return res.status( 401 ).json( { error: "You don't have permission to cancel this appointment" } );
    }

    // DIMINUI 2 HORAS DO HORARIO DO AGENDAMENTO
    const dateWithSub = subHours( appointment.date, 2 );

    if ( isBefore( dateWithSub, new Date() ) ) {
      return res.staus( 401 ).json( { error: 'You can only cancel 2 hours advanced' } );
    }

    appointment.canceled_at = new Date( );

    await appointment.save();

    await Queue.add( CancellationMail.key, {
      appointment,
    } );

    // RETORNA AS INFORMAÇÕES DO AGENDAMENTO CANCELADO
    return res.json( appointment );
  }
}

// EXPORT
export default new AppointmentController();
