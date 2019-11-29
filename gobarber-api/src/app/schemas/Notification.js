// NOTIFICATION SCHEMA

// IMPORTS
import mongoose from 'mongoose';

// CRIANDO O SCHEMA
const NotificationSchema = new mongoose.Schema( {
  // CONTEUDO DA NOTIFICAÇÃO
  content: {
    // TIPO
    type: String,
    required: true,
  },
  // QUAL USUÁRIO VAI RECEBER A NOTIFICAÇÃO
  user: {
    // TIPO
    type: Number,
    required: true,
  },
  // NOTIFICAÇÃO LIDA OU NÃO
  read: {
    // TIPO
    type: Boolean,
    required: true,
    // VALOR PADRÃO
    default: false,
  },
}, {
  // ADICIONA OS CAMPOS 'created_at' e 'updated_at'
  timestamps: true,
} );

// EXPORT
export default mongoose.model( 'Notification', NotificationSchema );
