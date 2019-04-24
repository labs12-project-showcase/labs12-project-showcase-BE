exports.seed = function(knex, Promise) {
  return knex("cohorts").insert([
    {
      cohort_name: "Web16"
    },
    {
      cohort_name: "Web17"
    },
    {
      cohort_name: "Web18"
    }
  ]);
};
