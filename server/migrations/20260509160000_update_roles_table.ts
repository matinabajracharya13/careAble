// migrations/20260509160000_update_roles_table.ts

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('roles', (table) => {
    table.string('label');
    table.string('icon_key');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('roles', (table) => {
    table.dropColumn('label');
    table.dropColumn('icon_key');
  });
}
