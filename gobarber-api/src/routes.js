// ROTAS DO APP

// IMPORTS
import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

const routes = new Router();
const updload = multer( multerConfig );

// ROTA DE CRIAÇÃO DE USUÁRIOS
routes.post( '/users', UserController.store );

// ROTA DE CRIAÇÃO DE SESÃO
routes.post( '/sessions', SessionController.store );

// MIDDLEWARE GLOBAL DE AUTENTICAÇÃO
routes.use( authMiddleware );

// ROTA DE ALTERAÇÃO DO USUÁRIO
routes.put( '/users', UserController.update );

// ROTA DE LISTAGEM DE PRESTADORES DE SERVIÇOS
routes.get( '/providers', ProviderController.index );
// ROTA DE LISTAGEM DE HORÁRIOS DISPONIVEIS PARA O PRESTADOR
routes.get( '/providers/:providerId/available', AvailableController.index );

// ROTA DE LISTAGEM DE AGENDAMENTOS
routes.get( '/appointments', AppointmentController.index );
// ROTA DE CRIAÇÃO DE AGENDAMENTOS
routes.post( '/appointments', AppointmentController.store );
// ROTA DE CANCELAMENTO DE AGENDAMENTO
routes.delete( '/appointments/:id', AppointmentController.delete );

// ROTA DE LISTAGEM DO PRESTADOR
routes.get( '/schedule', ScheduleController.index );

// ROTA DE LISTAGEM DE NOTIFICAÇÕES
routes.get( '/notifications', NotificationController.index );
// ROTA ONDE IRÁ ATUALIZAR A NOTIFICAÇÃO PARA LIDA
routes.put( '/notifications/:id', NotificationController.update );

// ROTA DE UPLOAD DE ARQUIVO
routes.post( '/files', updload.single( 'file' ), FileController.store );

// EXPORT
export default routes;
