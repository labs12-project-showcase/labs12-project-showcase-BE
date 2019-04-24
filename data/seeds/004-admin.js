const bcrypt = require("bcryptjs");
const email = process.env.INITIAL_ADMIN_EMAIL;
const password = bcrypt.hashSync(process.env.INITIAL_ADMIN_PASSWORD, 8);

exports.seed = function(knex, Promise) {
  return knex("accounts").insert([
    {
      role_id: 2,
      email,
      password,
      first_name: "Hire",
      last_name: "Lambda-Students"
    }
  ]);
};
