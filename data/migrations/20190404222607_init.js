exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("roles", tbl => {
      tbl.increments();
      tbl
        .string("role")
        .notNullable()
        .unique();
    })

    .createTable("accounts", tbl => {
      tbl.increments();
      tbl
        .integer("role_id")
        .unsigned()
        .references("roles.id")
        .defaultTo(1)
        .notNullable()
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      tbl.string("name");
      tbl.string("email").notNullable();
      tbl.string("sub_id").notNullable();
    })

    .createTable("tracks", tbl => {
      tbl.increments();
      tbl
        .string("name")
        .notNullable()
        .unique();
    })

    .createTable("cohorts", tbl => {
      tbl.increments();
      tbl
        .string("cohort_name")
        .notNullable()
        .unique();
    })

    .createTable("students", tbl => {
      tbl.increments();
      tbl
        .integer("account_id")
        .unsigned()
        .notNullable()
        .references("accounts.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("cohort_id")
        .unsigned()
        .references("cohorts.id")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      tbl
        .integer("track_id")
        .unsigned()
        .references("tracks.id")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      tbl.string("profile_pic");
      tbl.string("cloudinary_id");
      tbl.string("location");
      tbl.string("lat");
      tbl.string("lon");
      tbl.string("desired_title");
      tbl.text("about", 500);
      tbl.boolean("approved").defaultTo(false);
      tbl.boolean("hired").defaultTo(false);
      tbl.boolean("graduated").defaultTo(false);
      tbl.string("website");
      tbl.string("github").unique();
      tbl.string("linkedin");
      tbl.string("twitter");
      tbl.string("acclaim");
    })

    .createTable("student_skills", tbl => {
      tbl.increments();
      tbl
        .integer("student_id")
        .unsigned()
        .references("students.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("skill");
    })

    .createTable("top_skills", tbl => {
      tbl.increments();
      tbl
        .integer("student_id")
        .unsigned()
        .references("students.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("skill");
    })

    .createTable("desired_locations", tbl => {
      tbl.increments();
      tbl
        .integer("student_id")
        .unsigned()
        .references("students.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("location");
      tbl.string("lat");
      tbl.string("lon");
    })

    .createTable("hobbies", tbl => {
      tbl.increments();
      tbl
        .integer("student_id")
        .unsigned()
        .references("students.id")
        .notNullable()
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      tbl.string("hobby");
    })

    .createTable("endorsements", tbl => {
      tbl.increments();
      tbl
        .integer("from_id")
        .unsigned()
        .references("students.id")
        .notNullable()
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      tbl
        .integer("to_id")
        .unsigned()
        .references("students.id")
        .notNullable()
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      tbl.string("message");
    })

    .createTable("projects", tbl => {
      tbl.increments();
      tbl.string("youtube_url");
      tbl.string("short_description");
      tbl.string("name");
      tbl.string("github");
      tbl.string("website");
      tbl.text("tech_pitch");
      tbl.text("customer_pitch");
      tbl.string("medium");
      tbl.string("fe_link");
      tbl.string("be_link");
      tbl.string("mobile_link");
      tbl.string("market_link");
      tbl.string("design_link");
      tbl.boolean("approved").defaultTo(false);
    })

    .createTable("project_media", tbl => {
      tbl.increments();
      tbl
        .integer("project_id")
        .unsigned()
        .references("projects.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("media");
      tbl.string("cloudinary_id");
    })

    .createTable("project_skills", tbl => {
      tbl.increments();
      tbl
        .integer("project_id")
        .unsigned()
        .references("projects.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("skill");
    })

    .createTable("student_projects", tbl => {
      tbl.increments();
      tbl
        .integer("project_id")
        .unsigned()
        .references("projects.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("student_id")
        .unsigned()
        .references("students.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })

    .createTable("top_projects", tbl => {
      tbl.increments();
      tbl
        .integer("project_id")
        .unsigned()
        .references("projects.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("student_id")
        .unsigned()
        .references("students.id")
        .notNullable()
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists("roles")
    .dropTableIfExists("accounts")
    .dropTableIfExists("tracks")
    .dropTableIfExists("cohorts")
    .dropTableIfExists("students")
    .dropTableIfExists("student_skills")
    .dropTableIfExists("top_skills")
    .dropTableIfExists("desired_locations")
    .dropTableIfExists("hobbies")
    .dropTableIfExists("endorsements")
    .dropTableIfExists("projects")
    .dropTableIfExists("project_media")
    .dropTableIfExists("project_skills")
    .dropTableIfExists("student_projects")
    .dropTableIfExists("top_projects");
};
