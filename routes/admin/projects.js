const db = require("../../data/config");

module.exports = {
    deleteProject,
    updateProject,
    getProjects
};

function deleteProject(id) {
    return db("projects")
      .where({ id })
      .del();
}

function updateProject(id, info) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await db("projects")
          .where({ id })
          .update(info, "*");
  
        resolve(res);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
}

function getProjects() {
    return new Promise(async (resolve, reject) => {
      try {
        let projects = await db("projects as p")
          .select(
            "p.name",
            "p.short_description",
            "p.students",
            "p.approved",
            "p.id"
          )
          .innerJoin("student_projects as sp", "p.id", "sp.project_id");
        //   .leftOuterJoin("tracks as t", "t.id", "s.track_id")
        //   .leftOuterJoin("cohorts as c", "c.id", "s.cohort_id");
  
        resolve(projects);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
}