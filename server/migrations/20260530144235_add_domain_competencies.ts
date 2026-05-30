import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('competency_domains', (table) => {
    table.string('domain_id').primary(); // d1, d2...
    table.string('name').notNullable(); // short name
    table.string('full_name').notNullable(); // full display name

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('competency_domains');
}
