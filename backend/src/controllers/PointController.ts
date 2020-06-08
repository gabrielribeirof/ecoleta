import { Request, Response } from 'express';
import knex from '../database/connection';

class PointController {
  async index(request: Request, res: Response) {
    const points = await knex('points').select('*');

    return res.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if(!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const items = await knex('items')
    .join('point_items', 'items.id', '=', 'point_items.item_id')
    .where('point_items.point_id', id)
    .select('items.title');

    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      city,
      state,
      latitude,
      longitude,
      items
    } = request.body;

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

    const pointItems = items.map((item_id: Number) => {
      return {
        item_id,
        point_id
      }
    });

    await trx('point_items').insert(pointItems);

    return response.json({
      id: point_id,
      ...point
    });
  }
}

export default new PointController;