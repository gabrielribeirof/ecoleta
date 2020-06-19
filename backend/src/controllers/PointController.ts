import { Request, Response } from 'express';
import knex from '../database/connection';

class PointController {
  async index(request: Request, response: Response) {
    const { city, state, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('state', String(state))
      .distinct()
      .select('points.*');

    const serializedPoint = points.map(point => {
      return {
        ...point,
        image_url: `${process.env.APP_URL}/uploads/${point.image}`
      };
    });

    return response.json(serializedPoint);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if(!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const serializedPoint = {
      ...point,
      image_url: `${process.env.APP_URL}/uploads/${point.image}`
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point: serializedPoint, items });
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
      image: request.file.filename,
      email,
      whatsapp,
      city,
      state,
      latitude,
      longitude
    };

    const insertedIds = await trx('points').insert(point);
    
    const point_id = insertedIds[0];

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
      id: point_id,
      ...point
    });
  }
}

export default new PointController;