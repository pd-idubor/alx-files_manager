import express from 'express';
import AppController from '../controllers/AppController';

const routes = express.Router();

routes.get('/status', AppController.getstatus);
routes.get('/stats', AppController.getstats);

export default routes;
