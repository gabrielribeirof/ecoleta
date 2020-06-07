import { Request, Response } from 'express';
import knex from '../database/connection';

class PointController {
  async index(req: Request, res: Response) {
    const points = await knex('points').select('*');

    return res.json(points);
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      city,
      state,
      latitude,
      longitude,
      items
    } = req.body;

    const trx = await knex.transaction();

    const point = {
      name,
      image: 'image-fake',
      email,
      whatsapp,
      city,
      state,
      latitude,
      longitude
    };

    const insertedIds = await trx('points').insert(point);
    
    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id
      }
    });

    await trx('point_items').insert(pointItems);

    return res.json({
      id: point_id,
      ...point
    });
  }
}

export default new PointController;