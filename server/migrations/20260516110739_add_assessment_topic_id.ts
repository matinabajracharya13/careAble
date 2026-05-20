import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('domain_scores', (table) => {
    // remove old assessment_id foreign key
    table.dropForeign(['assessment_id']);

    // remove old column
    table.dropColumn('assessment_id');

    // add new assessment_topic_id column
    table.integer('assessment_topic_id').unsigned().notNullable();

    // add foreign key
    table.foreign('assessment_topic_id').references('assessment_topic_id').inTable('assessment_topics').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('domain_scores', (table) => {
    // remove new foreign key
    table.dropForeign(['assessment_topic_id']);

    // remove new column
    table.dropColumn('assessment_topic_id');

    // restore old assessment_id column
    table.integer('assessment_id').unsigned().notNullable();

    // restore foreign key
    table.foreign('assessment_id').references('assessment_id').inTable('assessments').onDelete('CASCADE');
  });
}
