import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('activities', (table) => {
    table.increments('activity_id').primary();

    table.integer('user_id').unsigned().nullable();
    table.integer('actor_id').unsigned().nullable(); // who triggered (admin/system/user)

    table.string('type').notNullable();
    table.string('title').notNullable();
    table.text('description').nullable();

    table.integer('related_id').nullable(); // assessment_id, certificate_id, etc
    table.string('related_type').nullable(); // 'assessment', 'certificate'

    table.json('meta').nullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('users.user_id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('activities');
}
