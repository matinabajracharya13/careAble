import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('onboarding_category_roles', (table) => {
    table.increments('id').primary();

    // FK → onboarding_categories
    table.integer('category_id').unsigned().notNullable().references('category_id').inTable('onboarding_categories').onDelete('CASCADE');

    // FK → roles table (FIXED)
    table.integer('role_id').unsigned().notNullable().references('role_id').inTable('roles').onDelete('CASCADE');

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['category_id', 'role_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('onboarding_category_roles');
}
