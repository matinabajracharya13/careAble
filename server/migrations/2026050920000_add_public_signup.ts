import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('roles', (table) => {
    table.boolean('is_public_signup').defaultTo(false);
  });

  await knex('roles').whereIn('role_name', ['carer', 'employer']).update({
    is_public_signup: true
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('roles', (table) => {
    table.dropColumn('is_public_signup');
  });
}
