import type { Knex } from "knex";

exports.seed = async function (knex:Knex) {
  await knex('onboarding_categories').insert([
    {
      title: 'Hidden Worker Status',
      description: 'Help us understand your current work situation',
      icon: 'Briefcase',
      display_order: 1
    },
    {
      title: 'CALD Status',
      description: 'Tell us about your language and cultural background',
      icon: 'Languages',
      display_order: 2
    },
    {
      title: 'Caregiving Information',
      description: 'Tell us about your caregiving journey',
      icon: 'HeartHandshake',
      display_order: 3
    }
  ]);
};
