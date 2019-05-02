const db = require("../../data/config");
const axios = require("axios");

module.exports = {
  endorseStudent,
  getStudentById,
  getStudentCards,
  getStudentEmail,
  // getStudentLocations,
  getStudentProfile,
  updateStudent
};

function endorseStudent(account_id, to_id, message) {
  return new Promise(async (resolve, reject) => {
    let result;
    try {
      await db.transaction(async t => {
        const fromId = await db("students as s")
          .select("s.id")
          .join("accounts as a", "a.id", "s.account_id")
          .where({ "a.id": account_id })
          .first()
          .transacting(t);

        const endorsement = {
          message,
          to_id,
          from_id: fromId.id
        };

        [result] = await db("endorsements")
          .insert(endorsement, "*")
          .transacting(t);
      });
      resolve(result);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function getStudentById(id) {
  return new Promise(async (resolve, reject) => {
    let student, endorsements, top_projects, projects;
    try {
      await db.transaction(async t => {
        student = await db("students as s")
          .select(
            "a.name",
            "s.*",
            "c.cohort_name",
            "t.name as track",
            db.raw("array_agg(distinct sk.skill) as skills"),
            db.raw("array_agg(distinct h.hobby) as hobbies"),
            db.raw("array_agg(distinct ts.skill) as top_skills"),
            db.raw("array_agg(distinct dl.location) as desired_locations")
          )
          .leftOuterJoin("accounts as a", "a.id", "s.account_id")
          .leftOuterJoin("cohorts as c", "c.id", "s.cohort_id")
          .leftOuterJoin("tracks as t", "t.id", "s.track_id")
          .leftOuterJoin("student_skills as sk", "sk.student_id", "s.id")
          .leftOuterJoin("hobbies as h", "h.student_id", "s.id")
          .leftOuterJoin("top_skills as ts", "ts.student_id", "s.id")
          .leftOuterJoin("desired_locations as dl", "dl.student_id", "s.id")
          .groupBy("a.name", "s.id", "c.cohort_name", "t.name")
          .where({ "s.id": id })
          .first()
          .transacting(t);

        endorsements = await db("endorsements as e")
          .select("e.message", "a.name")
          .join("students as s", "s.id", "e.from_id")
          .join("accounts as a", "a.id", "s.account_id")
          .where({ "e.to_id": id })
          .transacting(t);

        top_projects = await db("top_projects as tp")
          .select("p.*", db.raw("array_agg(distinct pm.media) as media"))
          .join("projects as p", "p.id", "tp.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .where({ "tp.student_id": id })
          .groupBy("p.id")
          .transacting(t);

        projects = await db("student_projects as sp")
          .select("p.*", db.raw("array_agg(distinct pm.media) as media"))
          .join("projects as p", "p.id", "sp.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .where({ "sp.student_id": id })
          .transacting(t)
          .groupBy("p.id");
      });
    } catch (error) {
      reject(error);
    }
    resolve({
      ...student,
      endorsements,
      top_projects,
      projects
    });
  });
}

function getStudentCards() {
  return new Promise(async (resolve, reject) => {
    try {
      const { rows: students } = await db.raw(
        "select s.id, a.name, s.linkedin, s.github, s.twitter, s.profile_pic, t.name as track, array_agg(distinct ts.skill) as top_skills, jsonb_agg(distinct jsonb_build_object('name', p.name, 'project_id', p.id, 'media', pm.media)) as top_projects from accounts as a inner join students as s on s.account_id = a.id left outer join tracks as t on s.track_id = t.id left outer join top_skills as ts on s.id = ts.student_id left outer join top_projects as tp on tp.student_id = s.id left outer join projects as p on p.id = tp.project_id left outer join project_media as pm on pm.id = ( select project_media.id from project_media where project_media.project_id = p.id limit 1)group by s.id, a.name, s.linkedin, s.github, s.twitter, s.profile_pic, t.name"
      );
      // students = await db("accounts as a")
      //   .select(
      //     "s.id",
      //     "a.name",
      //     "s.linkedin",
      //     "s.github",
      //     "s.twitter",
      //     "s.profile_pic",
      //     "t.name as track",
      //     db.raw("array_agg(ts.skill) as top_skills"),
      //     db.raw(
      //       "jsonb_agg(jsonb_build_object('name', p.name, 'project_id', p.id, 'media', pm.media)) as top_projects"
      //     )
      //   )
      //   .innerJoin("students as s", "s.account_id", "a.id")
      //   .leftOuterJoin("tracks as t", "s.track_id", "t.id")
      //   .leftOuterJoin("top_skills as ts", "s.id", "ts.student_id")
      //   .leftOuterJoin("top_projects as tp", "tp.student_id", "s.id")
      //   .leftOuterJoin("projects as p", "p.id", "tp.project_id")
      //   .leftOuterJoin(
      //     "project_media as pm",
      //     "pm.id",
      //     db.raw(
      //       "select project_media.id from project_media where project_media.project_id = p.id limit 1"
      //     )
      //   )
      //   .groupBy(
      //     "s.id",
      //     "a.name",
      //     "s.linkedin",
      //     "s.github",
      //     "s.twitter",
      //     "s.profile_pic",
      //     "t.name"
      //   )
      //   .debug();
      resolve(students);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function getStudentEmail(id) {
  return db("students")
    .select("accounts.email")
    .join("accounts", "accounts.id", "students.account_id")
    .where({ "students.id": id })
    .first();
}

function getStudentProfile(account_id, update) {
  return new Promise(async (resolve, reject) => {
    let student,
      endorsements,
      top_projects,
      projects,
      cohort_options,
      track_options;
    try {
      await db.transaction(async t => {
        student = await db("students as s")
          .select(
            "a.name",
            "s.*",
            "c.cohort_name",
            "t.name as track",
            db.raw("array_agg(distinct sk.skill) as skills"),
            db.raw("array_agg(distinct h.hobby) as hobbies"),
            db.raw("array_agg(distinct ts.skill) as top_skills"),
            db.raw("array_agg(distinct dl.location) as desired_locations")
          )
          .leftOuterJoin("accounts as a", "a.id", "s.account_id")
          .leftOuterJoin("cohorts as c", "c.id", "s.cohort_id")
          .leftOuterJoin("tracks as t", "t.id", "s.track_id")
          .leftOuterJoin("student_skills as sk", "sk.student_id", "s.id")
          .leftOuterJoin("hobbies as h", "h.student_id", "s.id")
          .leftOuterJoin("top_skills as ts", "ts.student_id", "s.id")
          .leftOuterJoin("desired_locations as dl", "dl.student_id", "s.id")
          .groupBy("a.name", "s.id", "c.cohort_name", "t.name")
          .where({ "s.account_id": account_id })
          .first()
          .transacting(t);

        endorsements = await db("endorsements as e")
          .select("e.message", "a.name")
          .join("students as s", "s.id", "e.from_id")
          .join("accounts as a", "a.id", "s.account_id")
          .where({ "e.to_id": student.id })
          .transacting(t);

        top_projects = await db("top_projects as tp")
          .select("p.*", db.raw("array_agg(distinct pm.media) as media"))
          .join("projects as p", "p.id", "tp.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .where({ "tp.student_id": student.id })
          .groupBy("p.id")
          .transacting(t);

        projects = await db("student_projects as sp")
          .select("p.*", db.raw("array_agg(distinct pm.media) as media"))
          .join("projects as p", "p.id", "sp.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .where({ "sp.student_id": student.id })
          .transacting(t)
          .groupBy("p.id");

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
      console.log(error);
      reject(error);
    }
    if (!student && !endorsements && !top_projects && !projects) {
      resolve(
        getGitHubInfo(account_id, {
          track_options,
          cohort_options
        })
      );
    }
    resolve({
      ...student,
      endorsements,
      top_projects,
      projects,
      track_options,
      cohort_options,
      exists: true
    });
  });
}

function getGitHubInfo(account_id, options) {
  return new Promise(async (resolve, reject) => {
    try {
      //GET MGR API ACCESS TOKEN
      const body = {
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        audience: process.env.OAUTH_MGR_API,
        grant_type: "client_credentials"
      };
      const {
        data: { access_token }
      } = await axios.post(process.env.OAUTH_TOKEN_API, body);

      //GET ACCOUNT SUB_ID
      const { sub_id } = await db("accounts")
        .select("sub_id")
        .where({ id: account_id })
        .first();

      //FETCH GHUB INFO
      const api = process.env.OAUTH_MGR_API;
      const url = `${api}users/${sub_id}`;
      const headers = {
        authorization: `Bearer ${access_token}`
      };

      const { data } = await axios.get(url, { headers });
      const info = {
        name: data.name,
        github: data.html_url,
        location: data.location,
        about: data.bio
      };

      resolve({ ...info, ...options, exists: false });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

//BACK BURNER
// function getStudentLocations() {
//   return db.raw(
//     "select a.first_name, a.last_name, s.location, s.profile_pic from students as s join accounts as a on a.id = s.account_id where s.location is not null"
//   );
// }

function updateStudent(account_id, info) {
  return new Promise(async (resolve, reject) => {
    /* 
      Info {
        account {
          name
        }
        student {

        }
        hobbies [

        ]
        top_skills [

        ]
        skills [

        ]
        desired_locations [

        ]
      }
    */
    //Initialize return value
    let updated;
    try {
      await db.transaction(async t => {
        //Update account if data exists
        let name;
        if (info.account && Object.keys(info.account).length) {
          [name] = await db("accounts")
            .update(info.account, "name")
            .where({ id: account_id })
            .transacting(t);
        }

        //Update students table if data exists and fetch the correct student_id
        let student;
        if (info.student && Object.keys(info.student).length) {
          [student] = await db("students")
            .update(info.student, "*")
            .where({ account_id })
            .transacting(t);
        } else {
          student = await db("students")
            .select("id")
            .where({ account_id })
            .first();
        }

        console.log("STUDENT_ID IN UPDATE", student.id);
        //Delete and then insert hobbies if data exsists
        let hobbies;
        if (info.hobbies && info.hobbies.length) {
          info.hobbies = info.hobbies.map(hobby => ({
            student_id: student.id,
            hobby
          }));
          await db("hobbies")
            .where({ student_id: student.id })
            .del()
            .transacting(t);
          hobbies = await db("hobbies")
            .insert(info.hobbies, "hobby")
            .transacting(t);
        }

        //Delete and then insert top_skills if data exsists
        let top_skills;
        if (info.top_skills && info.top_skills.length) {
          info.top_skills = info.top_skills.map(skill => ({
            student_id: student.id,
            skill
          }));
          await db("top_skills")
            .where({ student_id: student.id })
            .del()
            .transacting(t);
          top_skills = await db("top_skills")
            .insert(info.top_skills, "skill")
            .transacting(t);
        }

        //Delete and then insert skills if data exsists
        let skills;
        if (info.skills && info.skills.length) {
          info.skills = info.skills.map(skill => ({
            student_id: student.id,
            skill
          }));
          await db("student_skills")
            .where({ student_id: student.id })
            .del()
            .transacting(t);
          skills = await db("student_skills")
            .insert(info.skills, "skill")
            .transacting(t);
        }

        //Delete and then insert desired locations if data exsists
        let desired_locations;
        if (info.desired_locations && info.desired_locations.length) {
          info.desired_locations = info.desired_locations.map(location => ({
            student_id: student.id,
            location
          }));
          await db("desired_locations")
            .where({ student_id: student.id })
            .del()
            .transacting(t);
          desired_locations = await db("desired_locations")
            .insert(info.desired_locations, "location")
            .transacting(t);
        }

        updated = {
          name,
          ...student,
          hobbies,
          top_skills,
          skills,
          desired_locations
        };
      });
      resolve(updated);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
