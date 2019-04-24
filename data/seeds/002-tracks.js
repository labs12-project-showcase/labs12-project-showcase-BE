exports.seed = function(knex, Promise) {
  return knex("tracks").insert([
    { name: "Full-Stack Web Development & Computer Science" },
    { name: "iOS Development & Computer Science" },
    { name: "Data Science" },
    { name: "Android Development & Computer Science" },
    { name: "UX Design" }
  ]);
};
