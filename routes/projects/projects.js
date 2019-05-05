const db = require("../../data/config");

module.exports = {
  createProject,
  getProjectCards,
  getProjectById,
  updateProject
};

function createProject(info) {
  /*
  Info {
    student_id: Number,
    project: {

    },
    skills: [

    ],
    media: [

    ]
  }
  */
  let exists, project;
  return new Promise(async (resolve, reject) => {
    if (!info.project) {
      throw new Error("No project provided.");
    }
    try {
      await db.transaction(async t => {
        exists = await db("projects")
          .where({ github: info.project.github })
          .first();
        if (exists) {
          throw new Error("Project already exists.");
        } else {
          [project] = await db("projects")
            .insert(info.project, "*")
            .transacting(t);

          let media;
          if (info.media && info.media.length) {
            info.media = info.media.map(link => ({
              project_id: project.id,
              media: link
            }));
            media = await db("project_media")
              .insert(info.media, "media")
              .transacting(t);
          }

          let skills;
          if (info.skills && info.skills.length) {
            info.skills = info.skills.map(skill => ({
              project_id: project.id,
              skill
            }));
            skills = await db("project_skills")
              .insert(info.skills, "skill")
              .transacting(t);
          }

          const top_projects = await db("top_projects").where({ student_id });
          if (top_projects && top_projects.length >= 3) {
            await db("student_projects")
              .insert({
                project_id: project.id,
                student_id
              })
              .transacting(t);
          } else {
            await db("top_projects")
              .insert({
                project_id: project.id,
                student_id
              })
              .transacting(t);
          }
        }
      });
      resolve({ ...project, media, skills });
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
          "p.short_description",
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
          .transacting(t);

        students = await db("student_projects as sp")
          .select("s.profile_pic", "a.name", "s.id as student_id")
          .join("students as s", "s.id", "sp.student_id")
          .join("accounts as a", "a.id", "s.account_id")
          .where({ "sp.project_id": project.id })
          .transacting(t);
      });
      resolve({ ...project, students });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function updateProject(id, info) {
  return new Promise(async (resolve, reject) => {
    /*
      Info {
        Project {

        }
        Media [

        ]
        Skills [

        ]
      }
    */
    let updated;
    try {
      await db.transaction(async t => {
        //Update project table if exists
        let project;
        if (info.project && Object.keys(info.project).length) {
          [project] = await db("projects")
            .update(info.project, "*")
            .where({ id })
            .transacting(t);
        }

        //Delete old media and insert if exists
        let media;
        if (info.media && info.media.length) {
          info.media = info.media.map(link => ({
            project_id: id,
            media: link
          }));
          console.log(info.media);
          await db("project_media")
            .where({ project_id: id })
            .del()
            .transacting(t);
          media = await db("project_media")
            .insert(info.media, "media")
            .transacting(t);
        }

        let skills;
        if (info.skills && info.skills.length) {
          info.skills = info.skills.map(skill => ({
            project_id: id,
            skill
          }));
          await db("project_skills")
            .where({ project_id: id })
            .del()
            .transacting(t);
          skills = await db("project_skills")
            .insert(info.skills, "skill")
            .transacting(t);
        }

        updated = {
          ...project,
          media,
          skills
        };
      });
      resolve(updated);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
