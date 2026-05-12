import type { Knex } from "knex";

exports.up = async function (knex:Knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('first_name');
    table.string('last_name');
  });

  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('full_name');
  });
};

exports.down = async function (knex:Knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('full_name');
  });

  const users = await knex('users').select('user_id', 'first_name', 'last_name');

  for (const user of users) {
    await knex('users')
      .where({ user_id: user.user_id })
      .update({
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim()
      });
  }

  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('first_name');
    table.dropColumn('last_name');
  });
};