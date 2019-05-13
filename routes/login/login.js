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
  return new Promise(async (resolve, reject) => {
    let newUser;
    try {
      await db.transaction(async t => {
        const [account] = await db("accounts")
          .insert(info, "*")
          .transacting(t);

        if (info.role_id === 1) {
            await db("students")
            .insert({ account_id: account.id })
            .transacting(t);
        }

        newUser = await db("accounts")
          .select("accounts.*", "roles.role")
          .innerJoin("roles", "accounts.role_id", "roles.id")
          .where({ "accounts.id": account.id })
          .first()
          .transacting(t);
      });
      resolve(newUser);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}