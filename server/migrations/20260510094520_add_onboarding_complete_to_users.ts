import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', function(table) {
    table.boolean('onboarding_completed').notNullable().defaultTo(false);
  });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', function(table) {
    table.dropColumn('onboarding_completed');
  });
}

