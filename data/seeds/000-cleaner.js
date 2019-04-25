exports.seed = function(knex, Promise) {
  return knex.schema.raw(
    "TRUNCATE roles, accounts, tracks, cohorts, students, student_skills, top_skills, desired_locations, hobbies, endorsements, projects, project_media, project_skills, student_projects, top_projects RESTART IDENTITY;"
  );
};
