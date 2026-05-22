import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contacts', (table) => {
    table.increments('contact_id').primary();

    table.string('full_name', 150).notNullable();
    table.string('email', 255).notNullable();
    table.string('company', 150).nullable();
    table.string('subject', 200).notNullable();
    table.text('message').notNullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable('contacts', (table) => {
    table.index(['email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('contacts');
}
