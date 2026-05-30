import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('assessment_topic_domains', (table) => {
    table.increments('id').primary();

    table.integer('assessment_topic_id').unsigned().notNullable().references('assessment_topics.assessment_topic_id').onDelete('CASCADE');

    table.string('domain_id').notNullable().references('competency_domains.domain_id').onDelete('CASCADE');

    table.unique(['assessment_topic_id', 'domain_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('assessment_topic_domains');
}
