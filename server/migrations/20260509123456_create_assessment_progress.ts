import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('assessment_progress', (table) => {
    table.increments('progress_id').primary();

    table.integer('user_id').unsigned().notNullable();

    table.integer('assessment_id').unsigned().notNullable();

    // store all answers
    table.json('answers').notNullable();

    // restore UI stepper state
    table.integer('current_topic_index').defaultTo(0);

    table.integer('current_page').defaultTo(0);

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');

    table.foreign('assessment_id').references('assessment_id').inTable('assessments').onDelete('CASCADE');

    // one progress row per user per assessment
    table.unique(['user_id', 'assessment_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('assessment_progress');
}
