import express from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import multerConfig from './config/multer';

import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/items', ItemController.index);

routes.get('/points', PointController.index);
routes.get('/points/:id', PointController.show);
routes.post(
  '/points', 
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      city: Joi.string().required(),
      state: Joi.string().required().max(2),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      items: Joi.string().required(),
    })
  }, {
    abortEarly: false
  }),
  PointController.create
);

export default routes;