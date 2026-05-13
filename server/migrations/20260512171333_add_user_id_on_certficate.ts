import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Add column as nullable first (IMPORTANT for existing data)
  await knex.schema.alterTable('certificates', (table) => {
    table.integer('user_id').unsigned();
    table.index(['user_id']);
  });

  // 2. Backfill from assessment_attempts
  await knex('certificates').update({
    user_id: knex.raw(`
        (
          SELECT aa.user_id
          FROM assessment_attempts aa
          WHERE aa.attempt_id = certificates.attempt_id
        )
      `)
  });

  // 3. Now enforce NOT NULL + foreign key constraint
  await knex.schema.alterTable('certificates', (table) => {
    table.integer('user_id').unsigned().notNullable().alter();

    table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('certificates', (table) => {
    table.dropForeign(['user_id']);
    table.dropIndex(['user_id']);
    table.dropColumn('user_id');
  });
}
