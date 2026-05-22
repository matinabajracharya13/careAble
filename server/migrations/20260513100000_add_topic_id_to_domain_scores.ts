import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('domain_scores', (table) => {
    table
      .integer('topic_id')
      .unsigned()
      .nullable()
      .references('assessment_topic_id')
      .inTable('assessment_topics')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('domain_scores', (table) => {
    table.dropColumn('topic_id');
  });
}
