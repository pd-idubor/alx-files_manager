import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const routes = express.Router();

routes.get('/status', AppController.getstatus);
routes.get('/stats', AppController.getstats);
routes.get('/connect', AuthController.getConnect);
routes.get('/disconnect', AuthController.getDisconnect);
routes.get('/users/me', UsersController.getMe);

routes.post('/users', UsersController.postNew);
routes.post('/files', FilesController.postUpload);

export default routes;
