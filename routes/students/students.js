const db = require("../../data/config");

module.exports = {
  getStudentById,
  getStudentCards,
  // getStudentLocations,
  getStudentProfile,
  updateStudent
};

function getStudentById(id) {
  return new Promise(async (resolve, reject) => {
    let student,
      skills,
      hobbies,
      endorsements,
      top_skills,
      desired_locations,
      top_projects,
      projects;
    try {
      await db.transaction(async t => {
        student = await db("students as s")
          .select(
            "a.first_name",
            "a.last_name",
            "s.*",
            "c.cohort_name",
            "t.name as track"
          )
          .leftOuterJoin("accounts as a", "a.id", "s.account_id")
          .leftOuterJoin("cohorts as c", "c.id", "s.cohort_id")
          .leftOuterJoin("tracks as t", "t.id", "s.track_id")
          .where({ "s.id": id })
          .first()
          .transacting(t);

        skills = await db("student_skills as s")
          .select("s.skill")
          .where({ student_id: id })
          .transacting(t);

        hobbies = await db("hobbies as h")
          .select("h.hobby")
          .where({ student_id: id })
          .transacting(t);

        endorsements = await db("endorsements as e")
          .select("e.message", "a.first_name", "a.last_name")
          .join("students as s", "s.id", "e.from_id")
          .join("accounts as a", "a.id", "s.account_id")
          .where({ "e.to_id": id })
          .transacting(t);

        top_skills = await db("top_skills as ts")
          .select("ts.skill")
          .where({ student_id: id })
          .transacting(t);

        desired_locations = await db("desired_locations as dl")
          .select("dl.location")
          .where({ student_id: id })
          .transacting(t);

        top_projects = await db("top_projects as t")
          .select(
            "p.id",
            "p.name",
            "p.github",
            "pm.media",
            db.raw("array_agg(ps.skill) as skills")
          )
          .join("projects as p", "p.id", "t.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .leftOuterJoin("project_skills as ps", "ps.project_id", "p.id")
          .where({ "t.student_id": id, "p.approved": true })
          .groupBy("p.name", "p.github", "pm.media", "p.id")
          .transacting(t);

        projects = await db("student_projects as sp")
          .select(
            "p.id",
            "p.name",
            "p.github",
            "pm.media",
            db.raw("array_agg(ps.skill) as skills")
          )
          .join("projects as p", "p.id", "sp.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .leftOuterJoin("project_skills as ps", "ps.project_id", "p.id")
          .where({ "sp.student_id": id, approved: true })
          .groupBy("p.name", "p.github", "pm.media", "p.id")
          .transacting(t);
      });
    } catch (error) {
      reject(error);
    }
    resolve({
      ...student,
      top_skills,
      skills,
      hobbies,
      endorsements,
      desired_locations,
      top_projects,
      projects
    });
  });
}

function getStudentCards() {
  return new Promise(async (resolve, reject) => {
    let students;
    try {
      await db.transaction(async t => {
        students = await db("accounts as a")
          .select(
            "a.first_name",
            "a.last_name",
            "s.linkedin",
            "s.github",
            "s.twitter",
            "s.profile_pic",
            "t.name as track",
            db.raw("array_agg(ts.skill) as top_skills")
          )
          .innerJoin("students as s", "s.account_id", "a.id")
          .leftOuterJoin("tracks as t", "s.track_id", "t.id")
          .leftOuterJoin("top_skills as ts", "s.id", "ts.student_id")
          .groupBy(
            "a.first_name",
            "a.last_name",
            "s.linkedin",
            "s.github",
            "s.twitter",
            "s.profile_pic",
            "t.name"
          )
          .transacting(t);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
    resolve(students);
  });
}

function getStudentProfile(account_id, update) {
  return new Promise(async (resolve, reject) => {
    let student,
      skills,
      hobbies,
      endorsements,
      top_skills,
      desired_locations,
      top_projects,
      projects,
      cohort_options,
      track_options;
    try {
      await db.transaction(async t => {
        student = await db("students as s")
          .select(
            "a.first_name",
            "a.last_name",
            "s.*",
            "c.cohort_name",
            "t.name as track"
          )
          .leftOuterJoin("accounts as a", "a.id", "s.account_id")
          .leftOuterJoin("cohorts as c", "c.id", "s.cohort_id")
          .leftOuterJoin("tracks as t", "t.id", "s.track_id")
          .where({ "s.account_id": account_id })
          .first()
          .transacting(t);

        skills = await db("student_skills as s")
          .select("s.skill")
          .where({ student_id: student.id })
          .transacting(t);

        hobbies = await db("hobbies as h")
          .select("h.hobby")
          .where({ student_id: student.id })
          .transacting(t);

        endorsements = await db("endorsements as e")
          .select("e.message", "a.first_name", "a.last_name")
          .join("students as s", "s.id", "e.from_id")
          .join("accounts as a", "a.id", "s.account_id")
          .where({ "e.to_id": student.id })
          .transacting(t);

        top_skills = await db("top_skills as ts")
          .select("ts.skill")
          .where({ student_id: student.id })
          .transacting(t);

        desired_locations = await db("desired_locations as dl")
          .select("dl.location")
          .where({ student_id: student.id })
          .transacting(t);

        top_projects = await db("top_projects as t")
          .select(
            "p.id",
            "p.name",
            "p.github",
            "pm.media",
            db.raw("array_agg(ps.skill) as skills")
          )
          .join("projects as p", "p.id", "t.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .leftOuterJoin("project_skills as ps", "ps.project_id", "p.id")
          .where({ "t.student_id": student.id, "p.approved": true })
          .groupBy("p.name", "p.github", "pm.media", "p.id")
          .transacting(t);

        projects = await db("student_projects as sp")
          .select(
            "p.id",
            "p.name",
            "p.github",
            "pm.media",
            db.raw("array_agg(ps.skill) as skills")
          )
          .join("projects as p", "p.id", "sp.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .leftOuterJoin("project_skills as ps", "ps.project_id", "p.id")
          .where({ "sp.student_id": student.id, approved: true })
          .groupBy("p.name", "p.github", "pm.media", "p.id")
          .transacting(t);

        if (update === "true") {
          cohort_options = await db("cohorts as c")
            .select("id as cohort_id", "cohort_name")
            .transacting(t);

          track_options = await db("tracks as t")
            .select("t.id as track_id", "name")
            .transacting(t);
        }
      });
    } catch (error) {
      reject(error);
    }
    resolve({
      ...student,
      top_skills,
      skills,
      hobbies,
      endorsements,
      desired_locations,
      top_projects,
      projects,
      track_options,
      cohort_options
    });
  });
}

//BACK BURNER
// function getStudentLocations() {
//   return db.raw(
//     "select a.first_name, a.last_name, s.location, s.profile_pic from students as s join accounts as a on a.id = s.account_id where s.location is not null"
//   );
// }

function updateStudent(account_id, info, skills) {
  return new Promise(async (resolve, reject) => {
    let student, newSkills;
    try {
      await db.transaction(async t => {});
      resolve(updated);
    } catch (error) {
      reject(error);
    }
  });
}
