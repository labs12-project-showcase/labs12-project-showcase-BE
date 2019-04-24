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
  return new Promise(async (resolve, reject) => {
    let cohorts, type_options, mergedFields;
    await db.transaction(async t => {
      try {
        cohorts = await db("cohorts").transacting(t);
        type_options = await db("cohort_types")
          .select("id as cohort_type_id", "type")
          .transacting(t);

        mergedFields = cohorts.map(cohort => ({
          ...cohort,
          type_options
        }));

        resolve(mergedFields);
      } catch (error) {
        reject(error);
      }
    });
  });
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
