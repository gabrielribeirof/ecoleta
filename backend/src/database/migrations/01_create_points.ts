import Knex from 'knex';

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable('points', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('image').notNullable();
    table.string('email').notNullable();
    table.string('whatsapp').notNullable();
    table.string('city').notNullable();
    table.string('state', 2).notNullable();
    table.decimal('latitude').notNullable();
    table.decimal('longitude').notNullable();
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable('points');
}
