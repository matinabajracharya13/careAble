import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('assessment_progress', (table) => {
    table.integer('attempt_id').unsigned().notNullable();

    table.foreign('attempt_id').references('attempt_id').inTable('assessment_attempts').onDelete('CASCADE');

    table.unique(['attempt_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('assessment_progress', (table) => {
    table.dropUnique(['attempt_id']);
    table.dropForeign(['attempt_id']);
    table.dropColumn('attempt_id');
  });
}
