const db = require("../../data/config");

module.exports = {
  findUser,
  registerUser
};

function findUser(sub_id) {
  return db("accounts")
    .select("accounts.*", "roles.role")
    .innerJoin("roles", "accounts.role_id", "roles.id")
    .where({ "accounts.sub_id": sub_id })
    .first();
}

function registerUser(info) {
  return db("accounts").insert(info, "*");
}
