const bcrypt = require("bcryptjs");

const db = require("../../data/config");

module.exports = {
  addUser
};

function addUser(user) {
  user.password = bcrypt.hashSync(user.password, 8);

  return new Promise(async (resolve, reject) => {
    await db.transaction(async t => {
      try {
        const [{ id: account_id }] = await db("accounts")
          .insert(user, ["id"])
          .transacting(t);
        await db("students")
          .insert({ account_id })
          .transacting(t);
      } catch (error) {
        t.rollback();
        reject(error);
      }
    });
    resolve();
  });
}
