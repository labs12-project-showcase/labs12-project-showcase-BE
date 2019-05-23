const db = require("../../data/config");

module.exports = {
  deleteStudent,
  getStudents,
  updateStudent
};

function deleteStudent(id) {
  return db("students")
    .where({ id })
    .del();
}

function getStudents() {
  return new Promise(async (resolve, reject) => {
    try {
      let students = await db("students as s")
        .select(
          "a.name",
          "s.graduated",
          "s.highlighted",
          "s.hired",
          "s.approved",
          "t.name as track",
          "c.cohort_name",
          "s.id"
        )
        .innerJoin("accounts as a", "s.account_id", "a.id")
        .leftOuterJoin("tracks as t", "t.id", "s.track_id")
        .leftOuterJoin("cohorts as c", "c.id", "s.cohort_id");

      resolve(students);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function updateStudent(id, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const [ res ] = await db("students")
        .where({ id })
        .update(info, "*");

      resolve(res);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
