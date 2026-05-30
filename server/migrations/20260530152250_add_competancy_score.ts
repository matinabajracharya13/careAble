import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('competency_scores', (table) => {
    table.increments('competency_score_id').primary();

    table.integer('attempt_id').notNullable().references('attempt_id').inTable('assessment_attempts').onDelete('CASCADE');

    table.string('domain_code').notNullable();

    table.decimal('score', 5, 2).notNullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['attempt_id', 'domain_code']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('competency_scores');
}
