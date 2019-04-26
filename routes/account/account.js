const db = require("../../data/config");

module.exports = {
  deleteAccount,
  getAccount,
  updateAccount
};

function deleteAccount(id) {
  return "accounts".where({ id }).del();
}

function getAccount(id) {
  return db("accounts")
    .select("accounts.name", "roles.role")
    .where({ "accounts.id": id })
    .innerJoin("roles", "roles.id", "accounts.role_id")
    .first();
}

function updateAccount(id, info) {
  return new Promise(async (resolve, reject) => {
    let account;
    try {
      await db.transaction(async t => {
        await db("accounts")
          .where({ id })
          .update(info)
          .transacting(t);

        account = await db("accounts")
          .select("accounts.name", "roles.role")
          .where({ "accounts.id": id })
          .innerJoin("roles", "roles.id", "accounts.role_id")
          .first()
          .transacting(t);
      });
      resolve(account);
    } catch (error) {
      reject(error);
    }
  });
}
