import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. users
  await knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary();
    table.string("first_name");
    table.string("last_name");
    table.string("email").unique().notNullable();
    table.string("password_hash").notNullable();
    table.string("phone");
    table.date("date_of_birth");
    table.string("postcode");
    table.boolean("accepted_terms").defaultTo(false);
    table.boolean("research_consent").defaultTo(false);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 2. roles
  await knex.schema.createTable("roles", (table) => {
    table.increments("role_id").primary();
    table.string("role_name").unique().notNullable().comment("carer, admin, employer");
    table.string("description");
  });

  // 3. user_roles
  await knex.schema.createTable("user_roles", (table) => {
    table.increments("user_role_id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("role_id").unsigned().notNullable();
    table.integer("assigned_by").unsigned().nullable();
    table.timestamp("assigned_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("user_id").references("user_id").inTable("users").onDelete("CASCADE");
    table.foreign("role_id").references("role_id").inTable("roles").onDelete("CASCADE");
    table.foreign("assigned_by").references("user_id").inTable("users").onDelete("SET NULL");
  });

  // 4. onboarding_questions
  await knex.schema.createTable("onboarding_questions", (table) => {
    table.increments("question_id").primary();
    table.string("question_text");
    table.string("question_type").comment("text, boolean, single_select, multi_select");
    table.string("user_category");
    table.boolean("is_required");
    table.string("default_answer");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 5. question_options
  await knex.schema.createTable("question_options", (table) => {
    table.increments("question_option_id").primary();
    table.integer("question_id").unsigned().nullable();
    table.string("option_text");
    table.integer("option_value");

    table
      .foreign("question_id")
      .references("question_id")
      .inTable("onboarding_questions")
      .onDelete("CASCADE");
  });

  // 6. onboarding_answers
  await knex.schema.createTable("onboarding_answers", (table) => {
    table.increments("onboarding_answer_id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("question_id").unsigned().notNullable();
    table.text("answer_text");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("user_id").references("user_id").inTable("users").onDelete("CASCADE");
    table
      .foreign("question_id")
      .references("question_id")
      .inTable("onboarding_questions")
      .onDelete("CASCADE");
  });

  // 7. assessments
  await knex.schema.createTable("assessments", (table) => {
    table.increments("assessment_id").primary();
    table.string("domain").notNullable();
    table.string("version");
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 8. assessment_questions
  await knex.schema.createTable("assessment_questions", (table) => {
    table.increments("assessment_question_id").primary();
    table.integer("assessment_id").unsigned().notNullable();
    table.string("question_text").notNullable();
    table.string("question_type").comment("likert");
    table.integer("display_order");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("assessment_id")
      .references("assessment_id")
      .inTable("assessments")
      .onDelete("CASCADE");
  });

  // 9. assessment_question_options
  await knex.schema.createTable("assessment_question_options", (table) => {
    table.increments("assessment_question_options_id").primary();
    table.integer("assessment_question_id").unsigned().notNullable();
    table.string("option_label").notNullable().comment("e.g. not at all");
    table.text("option_value").comment("e.g. 1, 2, 3");

    table
      .foreign("assessment_question_id")
      .references("assessment_question_id")
      .inTable("assessment_questions")
      .onDelete("CASCADE");
  });

  // 10. assessment_attempts
  await knex.schema.createTable("assessment_attempts", (table) => {
    table.increments("attempt_id").primary();
    table.integer("assessment_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.string("status");
    table.timestamp("started_at").nullable();
    table.timestamp("submitted_at").nullable();

    table
      .foreign("assessment_id")
      .references("assessment_id")
      .inTable("assessments")
      .onDelete("CASCADE");
    table.foreign("user_id").references("user_id").inTable("users").onDelete("CASCADE");
  });

  // 11. assessment_responses
  await knex.schema.createTable("assessment_responses", (table) => {
    table.increments("response_id").primary();
    table.integer("attempt_id").unsigned().notNullable();
    table.integer("assessment_question_id").unsigned().notNullable();
    table.integer("selected_option_id").unsigned().notNullable();
    table.integer("numeric_value");

    table
      .foreign("attempt_id")
      .references("attempt_id")
      .inTable("assessment_attempts")
      .onDelete("CASCADE");
    table
      .foreign("assessment_question_id")
      .references("assessment_question_id")
      .inTable("assessment_questions")
      .onDelete("CASCADE");
    table
      .foreign("selected_option_id")
      .references("assessment_question_options_id")
      .inTable("assessment_question_options")
      .onDelete("CASCADE");
  });

  // 12. domain_scores
  await knex.schema.createTable("domain_scores", (table) => {
    table.increments("domain_score_id").primary();
    table.integer("attempt_id").unsigned().notNullable();
    table.integer("assessment_id").unsigned().notNullable();
    table.float("score");
    table.float("full_score");
    table
      .string("capability_level")
      .comment("Strength area, Growth area, Support area");

    table
      .foreign("attempt_id")
      .references("attempt_id")
      .inTable("assessment_attempts")
      .onDelete("CASCADE");
    table
      .foreign("assessment_id")
      .references("assessment_id")
      .inTable("assessments")
      .onDelete("CASCADE");
  });

  // 13. certificates
  await knex.schema.createTable("certificates", (table) => {
    table.increments("certificate_id").primary();
    table.string("certificate_code").unique().notNullable();
    table.integer("attempt_id").unsigned().notNullable();
    table.timestamp("issued_at").nullable();
    table.string("pdf_url");
    table.string("validity_status");
    table.date("validity_date");

    table
      .foreign("attempt_id")
      .references("attempt_id")
      .inTable("assessment_attempts")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop in reverse order to respect foreign key constraints
  await knex.schema.dropTableIfExists("certificates");
  await knex.schema.dropTableIfExists("domain_scores");
  await knex.schema.dropTableIfExists("assessment_responses");
  await knex.schema.dropTableIfExists("assessment_attempts");
  await knex.schema.dropTableIfExists("assessment_question_options");
  await knex.schema.dropTableIfExists("assessment_questions");
  await knex.schema.dropTableIfExists("assessments");
  await knex.schema.dropTableIfExists("onboarding_answers");
  await knex.schema.dropTableIfExists("question_options");
  await knex.schema.dropTableIfExists("onboarding_questions");
  await knex.schema.dropTableIfExists("user_roles");
  await knex.schema.dropTableIfExists("roles");
  await knex.schema.dropTableIfExists("users");
}
