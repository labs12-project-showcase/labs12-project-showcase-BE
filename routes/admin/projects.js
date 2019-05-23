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
      const [res] = await db("projects")
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
      const { rows: projects } = await db.raw(`
        select 
        p.id, 
        p.name, 
        p.short_description, 
        p.approved, 
        jsonb_agg(distinct jsonb_build_object('name', a.name, 'student_id', s.id)) as students 
        from projects as p
        left outer join student_projects as sp on sp.project_id = p.id
        left outer join top_projects as tp on tp.project_id = p.id
        left outer join students as s on s.id = sp.student_id or s.id = tp.student_id 
        left outer join accounts as a on a.id = s.account_id 
        group by p.id
      `);

      resolve(projects);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
