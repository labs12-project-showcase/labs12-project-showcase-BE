const db = require("../../data/config");

module.exports = {
  createProject,
  getProjectCards,
  getUserProjectCards,
  getProjectById,
  updateProject
};

function createProject(info) {
  const { student_id, ...rest } = info;
  let project;
  return new Promise(async (resolve, reject) => {
    try {
      await db.transaction(async t => {
        [project] = await db("projects")
          .insert(rest, "*")
          .transacting(t);

        await db("student_projects")
          .insert({
            project_id: project.id,
            student_id
          })
          .transacting(t);
      });
      resolve(project);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function getProjectCards() {
  return new Promise(async (resolve, reject) => {
    try {
      const projects = await db("projects as p")
        .select(
          "p.id",
          "p.name",
          //"p.type",
          db.raw("array_agg(distinct pm.media) as project_media")
        )
        .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
        .groupBy("p.id");

      resolve(projects);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function getUserProjectCards(id) {}

function getProjectById(id) {
  return new Promise(async (resolve, reject) => {
    let project, students;
    try {
      await db.transaction(async t => {
        project = await db("projects as p")
          .select(
            "p.*",
            db.raw("array_agg(distinct ps.skill) as project_skills"),
            db.raw("array_agg(distinct pm.media) as project_media")
          )
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .leftOuterJoin("project_skills as ps", "ps.project_id", "p.id")
          .where({ "p.id": id })
          .first()
          .groupBy("p.id")
          .debug();

        students = await db("student_projects as sp")
          .select("s.profile_pic", "a.first_name", "a.last_name")
          .join("students as s", "s.id", "sp.student_id")
          .join("accounts as a", "a.id", "s.account_id")
          .where({ "sp.project_id": project.id });
      });
      resolve({ ...project, students });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function updateProject(id, info) {}
