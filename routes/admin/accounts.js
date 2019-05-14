const db = require("../../data/config");

module.exports = {
  deleteAccount,
  getAccounts,
  updateAccount
};

function deleteAccount(id) {
  return db("accounts")
    .where({ id })
    .del();
}

function getAccounts() {
  return new Promise(async (resolve, reject) => {
    let accounts, role_options, mergedFields;
    try {
      await db.transaction(async t => {
        accounts = await db("accounts")
          .select(
            "accounts.email",
            "accounts.id",
            "accounts.name",
            "accounts.role_id",
            "roles.role"
          )
          .innerJoin("roles", "accounts.role_id", "roles.id")
          .transacting(t);

        role_options = await db("roles")
          .select("id as role_id", "role")
          .transacting(t);
      });
      mergedFields = accounts.map(account => ({
        ...account,
        role_options
      }));
      resolve(mergedFields);
    } catch (error) {
      reject(error);
    }
  });
}

function updateAccount(id, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const [account] = await db("accounts")
        .where({ id })
        .update(info, ["id", "name", "role_id"]);
        const result = await db("accounts")
        .select(
          "accounts.email",
          "accounts.id",
          "accounts.name",
          "accounts.role_id",
          "roles.role"
        )
        .innerJoin("roles", "accounts.role_id", "roles.id")
        .where({ "accounts.id": id })
        .first()
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
