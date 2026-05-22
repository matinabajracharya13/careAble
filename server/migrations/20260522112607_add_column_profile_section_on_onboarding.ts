import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('onboarding_questions', (table) => {
    // section shown in UI/profile
    table.string('profile_section');
    table.string('profile_label');
    // clean API key
    table.string('profile_key');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('onboarding_questions', (table) => {
    table.dropColumn('profile_section');
    table.dropColumn('profile_key');
    table.dropColumn('profile_label');
  });
}
