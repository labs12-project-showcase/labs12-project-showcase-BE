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
        const [ res ] = await db("projects")
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
      // const projects = await db("projects as p")
      //   .select(
      //     "p.id",
      //     "p.name",
      //     "p.short_description",
      //     "p.approved",
      //     db.raw("array_agg(sp.student_id) as student_ids"),
      //     db.raw("array_agg(a.name) as students")
      //   )
      //   .leftOuterJoin("student_projects as sp", "sp.project_id", "p.id")
      //   .leftOuterJoin("top_projects as tp", "tp.project_id", "p.id")
      //   .leftOuterJoin("students as s", "s.id", "sp.student_id")
      //   .leftOuterJoin("accounts as a", "a.id", "s.id")
      //   .groupBy("p.id")
      //   .debug();

      const projects = await db("projects as p")
        .select(
          "p.id",
          "p.name",
          "p.short_description",
          "p.approved",
          db.raw("array_agg((s.id, a.name)) as students")
        )
        .leftOuterJoin("student_projects as sp", "sp.project_id", "p.id")
        .leftOuterJoin("top_projects as tp", "tp.project_id", "p.id")
        .leftOuterJoin(db.raw("students as s on s.id = sp.student_id or s.id = tp.student_id"))
        .leftOuterJoin("accounts as a", "a.id", "s.id")
        .groupBy("p.id")

      // resolve(projects.map(project => {
      //   return {
      //     ...project, 
      //     students: project.students.map((student, index) => {
      //     return {
      //       name: student,
      //       student_id: project.student_ids[index]
      //     }
      //   })}
      //   }
      // ))

      resolve(projects);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

// function getProjects() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await db.transaction(async t => {
//       const projects = await db("projects as p")
//         .select(
//           "p.id",
//           "p.name",
//           "p.short_description",
//           "p.approved",
//           db.raw("array_agg(sp.student_id) as student_ids"),
//           db.raw("array_agg(a.name) as students")
//         )
//         .leftOuterJoin("student_projects as sp", "sp.project_id", "p.id")
//         .leftOuterJoin("top_projects as tp", "tp.project_id", "p.id")
//         .leftOuterJoin("students as s", "s.id", "sp.student_id")
//         .leftOuterJoin("accounts as a", "a.id", "s.id")
//         .groupBy("p.id")
//         .transacting(t);
        
//         const top_students = await db("top_projects as tp")
//           .select("s.profile_pic", "a.name", "s.id as student_id")
//           .join("students as s", "s.id", "tp.student_id")
//           .join("accounts as a", "a.id", "s.account_id")
//           .transacting(t);
//       });
//       resolve(projects.map(project => {
//         return {
//           ...project,
//           ...top_students, 
//           students: project.students.map((student, index) => {
//           return {
//             name: student,
//             student_id: project.student_ids[index]
//           }
//         })}
//         }
//       ))
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// }