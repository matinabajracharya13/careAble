// migrations/20260509153000_update_user_name_columns.ts

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('full_name');
  });

  // copy existing data into full_name
  await knex.raw(`
    UPDATE users
    SET full_name = 
      TRIM(
        COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
      )
  `);

  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('first_name');
    table.dropColumn('last_name');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('first_name');
    table.string('last_name');
  });

  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('full_name');
  });
}
