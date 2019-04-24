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
      let students = await db("students")
        .select("accounts.first_name", "accounts.last_name", "students.*")
        .innerJoin("accounts", "students.account_id", "accounts.id");
      if (students) {
        const cohort_options = await db("cohorts").select(
          "id as cohort_id",
          "cohort_name"
        );
        const mergedFields = students.map(student => ({
          ...student,
          cohort_options
        }));
        resolve(mergedFields);
      } else {
        reject();
      }
    } catch (error) {
      reject();
    }
  });
}

function updateStudent(id, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await db("students")
        .where({ id })
        .update(info);

      if (count) {
        resolve(
          db("students")
            .select("accounts.first_name", "accounts.last_name", "students.*")
            .innerJoin("accounts", "students.account_id", "accounts.id")
            .where({ "students.id": id })
            .first()
        );
      } else {
        reject();
      }
    } catch (error) {
      reject();
    }
  });
}
