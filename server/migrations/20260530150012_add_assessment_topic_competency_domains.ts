import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('assessment_topic_competency_domains', (table) => {
    table.increments('id');

    table.integer('assessment_topic_id').unsigned().notNullable();
    table.string('domain_id').notNullable(); // d1 - d12

    table.timestamps(true, true);

    table.foreign('assessment_topic_id').references('assessment_topic_id').inTable('assessment_topics').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('assessment_topic_competency_domains');
}
