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


// function getProjects() {
//   return new Promise(async (resolve, reject) => {
//     let projects, students;
//     try {
//       await db.transaction(async t => {
//         projects = await db("projects as p")
//           .select(
//             "p.*",
//             db.raw("array_agg(distinct ps.skill) as project_skills"),
//             db.raw("array_agg(distinct pm.media) as project_media")
//           )
//           .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
//           .leftOuterJoin("project_skills as ps", "ps.project_id", "p.id")
//           .groupBy("p.id")
//           .transacting(t);

//         students = await db("student_projects as sp")
//           .select("s.profile_pic", "a.name", "s.id as student_id")
//           .join("students as s", "s.id", "sp.student_id")
//           .join("accounts as a", "a.id", "s.account_id")
//           .transacting(t);

//         const top_students = await db("top_projects as tp")
//           .select("s.profile_pic", "a.name", "s.id as student_id")
//           .join("students as s", "s.id", "tp.student_id")
//           .join("accounts as a", "a.id", "s.account_id")
//           .transacting(t);

//         students = [...students, ...top_students];
//       });
//       resolve({ ...projects, students });
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// }




function getProjects() {
  return new Promise(async (resolve, reject) => {
    try {
      const projects = await db("projects as p")
        .select(
          "p.id",
          "p.name",
          "p.short_description",
          "p.approved",
          db.raw("array_agg(distinct sp.student_id) as student_ids"),
          db.raw("array_agg(distinct a.name) as students")
        )
        .leftOuterJoin("student_projects as sp", "sp.project_id", "p.id")
        .leftOuterJoin("students as s", "s.id", "sp.student_id")
        .leftOuterJoin("accounts as a", "a.id", "s.id")
        .groupBy("p.id");

      resolve(projects.map(project => {
        return {
          ...project, 
          students: project.students.map((student, index) => {
          return {
            name: student,
            student_id: project.student_ids[index]
          }
        })}
        }
      ))
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}


// function getProjects() {
//   return new Promise(async (resolve, reject) => {
//     let project, students;
//     try {
//       await db.transaction(async t => {
//         projects = await db("projects as p")
//           .select(
//             "p.id",
//             "p.name",
//             "p.short_description",
//             "p.approved",
//             db.raw("array_agg(distinct sp.student_id) as student_ids"),
//             db.raw("array_agg(distinct a.name) as students")
//           )
//           .leftOuterJoin("student_projects as sp", "sp.project_id", "p.id")
//           .leftOuterJoin("students as s", "s.id", "sp.student_id")
//           .leftOuterJoin("accounts as a", "a.id", "s.id")
//           .groupBy("p.id")
//           .transacting(t);

//         students = await db("student_projects as sp")
//           .select("s.profile_pic", "a.name", "s.id as student_id")
//           .join("students as s", "s.id", "sp.student_id")
//           .join("accounts as a", "a.id", "s.account_id")
//           .transacting(t);

//         const top_students = await db("top_projects as tp")
//           .select("s.profile_pic", "a.name", "s.id as student_id")
//           .join("students as s", "s.id", "tp.student_id")
//           .join("accounts as a", "a.id", "s.account_id")
//           .transacting(t);

//         students = [...students, ...top_students];
//       });
//       resolve({ ...projects, students });
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// }