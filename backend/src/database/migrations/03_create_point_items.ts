import Knex from 'knex';

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable('point_items', (table) => {
    table.increments('id').primary();
    table.integer('point_id').references('id').inTable('points').notNullable();
    table.integer('item_id').references('id').inTable('items').notNullable();
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable('point_items');
}
