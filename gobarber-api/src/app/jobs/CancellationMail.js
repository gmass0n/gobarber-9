// CANCELLATION MAIL JOB

// IMPORTS
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle( { data } ) {
    // TODAS INFORMAÇÕES QUE VAO CHEGAR PRO NOSSO ENVIO DE EMAIL
    const { appointment } = data;

    // FORMATO DO EMAIL QUE SERA ENVIADO
    await Mail.sendMail( {
      // REMETENTE
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      // ASSUNTO
      subject: 'Agendamento cancelado',
      // TEMPLATE
      template: 'cancellation',
      // VARIAVEIS QUE O TEMPLATE IRÁ USAR
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO( appointment.date ),
          "'dia' dd 'de' MMMM', ás' H:mm'h'",
          { locale: pt },
        ),
      },
    } );
  }
}

// EXPORT
export default new CancellationMail();
