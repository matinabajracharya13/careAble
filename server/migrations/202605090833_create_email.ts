import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  /**
   * USERS
   */
  await knex.schema.alterTable('users', (table) => {
    table.boolean('email_verified').defaultTo(false);
    table.boolean('profile_completed').defaultTo(false);

    // optional but highly recommended
    table.timestamp('email_verified_at').nullable();
    table.timestamp('last_login_at').nullable();
  });

  /**
   * EMAIL VERIFICATION TOKENS
   */
  await knex.schema.createTable('email_verification_tokens', (table) => {
    table.increments('verification_id').primary();

    table.integer('user_id').unsigned().notNullable();

    table.string('token').notNullable().unique();

    table.timestamp('expires_at').notNullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');
  });

  /**
   * PASSWORD RESET TOKENS
   * (recommended to add now)
   */
  await knex.schema.createTable('password_reset_tokens', (table) => {
    table.increments('reset_id').primary();

    table.integer('user_id').unsigned().notNullable();

    table.string('token').notNullable().unique();

    table.timestamp('expires_at').notNullable();

    table.boolean('used').defaultTo(false);

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('user_id').inTable('users').onDelete('CASCADE');
  });

  /**
   * OPTIONAL:
   * Add indexes for performance
   */
  await knex.schema.alterTable('users', (table) => {
    table.index(['email']);
  });

  await knex.schema.alterTable('email_verification_tokens', (table) => {
    table.index(['token']);
    table.index(['user_id']);
  });

  await knex.schema.alterTable('password_reset_tokens', (table) => {
    table.index(['token']);
    table.index(['user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  /**
   * DROP TOKEN TABLES
   */
  await knex.schema.dropTableIfExists('password_reset_tokens');

  await knex.schema.dropTableIfExists('email_verification_tokens');

  /**
   * REMOVE USER COLUMNS
   */
  await knex.schema.alterTable('users', (table) => {
    table.dropIndex(['email']);

    table.dropColumn('email_verified');
    table.dropColumn('profile_completed');
    table.dropColumn('email_verified_at');
    table.dropColumn('last_login_at');
  });
}
