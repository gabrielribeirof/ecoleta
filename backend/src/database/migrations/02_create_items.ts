import Knex from 'knex';

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('image').notNullable();
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable('items');
}
