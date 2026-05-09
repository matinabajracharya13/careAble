import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Add missing columns to assessments
  await knex.schema.alterTable("assessments", (table) => {
    table.string("title");
    table.text("description");
  });

  // 2. Create assessment_topics
  await knex.schema.createTable("assessment_topics", (table) => {
    table.increments("assessment_topic_id").primary();
    table.integer("assessment_id").unsigned().notNullable();
    table.string("title").notNullable();
    table.string("code"); // e.g. social, emotional
    table.integer("display_order");

    table
      .foreign("assessment_id")
      .references("assessment_id")
      .inTable("assessments")
      .onDelete("CASCADE");
  });

  // 3. Add topic reference to questions
  await knex.schema.alterTable("assessment_questions", (table) => {
    table.integer("assessment_topic_id").unsigned();

    table
      .foreign("assessment_topic_id")
      .references("assessment_topic_id")
      .inTable("assessment_topics")
      .onDelete("CASCADE");
  });

  // 4. Improve option value type (optional but recommended)
  await knex.schema.alterTable("assessment_question_options", (table) => {
    table.integer("numeric_value"); // for scoring (1–5 Likert)
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("assessment_question_options", (table) => {
    table.dropColumn("numeric_value");
  });

  await knex.schema.alterTable("assessment_questions", (table) => {
    table.dropForeign(["assessment_topic_id"]);
    table.dropColumn("assessment_topic_id");
  });

  await knex.schema.dropTableIfExists("assessment_topics");

  await knex.schema.alterTable("assessments", (table) => {
    table.dropColumn("title");
    table.dropColumn("description");
  });
}