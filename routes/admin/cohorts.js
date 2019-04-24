const db = require("../../data/config");

module.exports = {
  addCohort,
  deleteCohort,
  getCohorts,
  updateCohort
};

function addCohort(info) {
  return new Promise(async (resolve, reject) => {
    try {
      const [res] = await db("cohorts").insert(info, "*");
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}

function deleteCohort(id) {
  return db("cohorts")
    .where({ id })
    .del();
}

function getCohorts() {
  return db("cohorts");
}

function updateCohort(id, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const [res] = await db("cohorts")
        .where({ id })
        .update(info, "*");
      resolve(res);
    } catch (error) {
      reject();
    }
  });
}
