import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('assessment_topic_domains').del();
  await knex('competency_domains').del();

  await knex('competency_domains').insert([
    { domain_id: 'd1', name: 'Communication', full_name: 'Communication & Relational Care' },
    { domain_id: 'd2', name: 'Advocacy', full_name: 'System Navigation & Advocacy' },
    { domain_id: 'd3', name: 'Emotional Resilience', full_name: 'Emotional Resilience & Self-Regulation' },
    { domain_id: 'd4', name: 'Self-Care', full_name: 'Self-Care & Energy Management' },
    { domain_id: 'd5', name: 'Belonging', full_name: 'Social Connection & Belonging' },
    { domain_id: 'd6', name: 'Information Filtering', full_name: 'Group Communication & Information Filtering' },
    { domain_id: 'd7', name: 'Practical Care', full_name: 'Practical Care & Safety Awareness' },
    { domain_id: 'd8', name: 'Ethical Practice', full_name: 'Cultural, Spiritual & Ethical Practice' },
    { domain_id: 'd9', name: 'Adaptability', full_name: 'Adaptability & Learning Orientation' },
    { domain_id: 'd10', name: 'Digital Literacy', full_name: 'Digital Literacy' },
    { domain_id: 'd11', name: 'Planning', full_name: 'Planning & Organisation' },
    { domain_id: 'd12', name: 'Leadership', full_name: 'Leadership & Coordination' }
  ]);
}
