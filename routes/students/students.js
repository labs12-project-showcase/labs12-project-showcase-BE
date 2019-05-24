const db = require("../../data/config");
const axios = require("axios");
const cloudinary = require("cloudinary");

module.exports = {
  deleteProfilePicture,
  endorseStudent,
  getStudentById,
  getStudentCards,
  getFilteredStudentCards,
  getStudentEmail,
  getStudentLocations,
  getStudentProfile,
  updateStudent,
  deleteStudent
  // deleteAuth0User
};

// function deleteStudent(id) {
//   return db("accounts")
//     .where({ id })
//     .del();
// }

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
    let student, desired_locations, endorsements, top_projects, projects;
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
            db.raw("array_agg(distinct ts.skill) as top_skills")
          )
          .leftOuterJoin("accounts as a", "a.id", "s.account_id")
          .leftOuterJoin("cohorts as c", "c.id", "s.cohort_id")
          .leftOuterJoin("tracks as t", "t.id", "s.track_id")
          .leftOuterJoin("student_skills as sk", "sk.student_id", "s.id")
          .leftOuterJoin("hobbies as h", "h.student_id", "s.id")
          .leftOuterJoin("top_skills as ts", "ts.student_id", "s.id")
          .groupBy("a.name", "s.id", "c.cohort_name", "t.name")
          .where({ "s.id": id })
          .first()
          .transacting(t);

        desired_locations = await db("desired_locations as dl")
          .select("lat", "location", "lon")
          .where({ "dl.student_id": id })
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
          .where({ "tp.student_id": id, "p.approved": true })
          .groupBy("p.id")
          .transacting(t);

        projects = await db("student_projects as sp")
          .select("p.*", db.raw("array_agg(distinct pm.media) as media"))
          .join("projects as p", "p.id", "sp.project_id")
          .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
          .where({ "sp.student_id": id, "p.approved": true })
          .transacting(t)
          .groupBy("p.id");
      });
    } catch (error) {
      reject(error);
    }
    resolve({
      ...student,
      desired_locations,
      endorsements,
      top_projects,
      projects
    });
  });
}

function getFilteredStudentCards({
  badge = null,
  filterDesLoc = false,
  lat = null,
  lon = null,
  tracks,
  within = null,
  search = null,
  offset = 0
}) {
  let trackString = "and (";
  if (tracks !== "none") {
    let splitTracks = tracks.split("");
    splitTracks.forEach((t, i) => {
      if (i === 0) {
        trackString = trackString + "track_id = " + t;
      } else {
        trackString = trackString + " or track_id = " + t;
      }
    });
    trackString = trackString + ")";
  }

  const locQuery = lat && lon && within;
  function determineQuery() {
    if (locQuery) {
      const dlString = `
                      point(${lon}, ${lat}) <@> 
                      point(to_number(dl.lon, '99G999D9S'), to_number(dl.lat, '99G999D9S')) 
                      < ${within}`;
      const locString = `
                        point(${lon}, ${lat}) <@> 
                        point(to_number(s.lon, '99G999D9S'), to_number(s.lat, '99G999D9S')) 
                        < ${within}`;
      if (filterDesLoc) {
        if (search) {
          return `and ${dlString} or ${locString}`;
        } else if (!search) {
          return `where ${dlString} or ${locString}`;
        }
      } else if (filterDesLoc === false) {
        if (search) {
          return `and ${locString}`;
        } else if (!search) {
          return `where ${locString}`;
        }
      }
    } else {
      return "";
    }
  }
  const des_loc_query_no_search =
    lat && lon && within && filterDesLoc === "true" && !search;
  const des_loc_query_with_search =
    lat && lon && within && filterDesLoc === "true" && search;

  return new Promise(async (resolve, reject) => {
    try {
      const { rows: students } = await db.raw(
        `select
          s.id,
          a.name,
          s.location,
          s.lat,
          s.lon,
          s.highlighted,
          s.profile_pic,
          s.desired_title,
          coalesce(jsonb_agg(distinct ts.skill) filter (where ts.skill is not null), '[]') as top_skills,
          coalesce(jsonb_agg(distinct sk.skill) filter (where sk.skill is not null), '[]') as skills, 
          coalesce(jsonb_agg(distinct jsonb_build_object('name', p.name, 'project_id', p.id, 'media', pm.media)) 
          filter (where p.name is not null), '[]') as top_projects,
          ${
            filterDesLoc === "true"
              ? "jsonb_agg(distinct jsonb_build_object('lat', dl.lat, 'location', dl.location, 'lon', dl.lon)) as desired_locations"
              : null
          }
          from accounts as a
          inner join students as s on s.account_id = a.id
          and approved = true
          ${badge === "true" ? "and acclaim != '' and acclaim is not null" : ""}
          ${tracks === "none" ? "" : `${trackString}`}
          left outer join tracks as t on s.track_id = t.id
          left outer join top_skills as ts on s.id = ts.student_id
          left outer join student_skills as sk on s.id = sk.student_id
          left outer join top_skills as ts_alias on s.id = ts_alias.student_id
          left outer join top_projects as tp on tp.student_id = s.id
          left outer join projects as p on p.id = tp.project_id
          and p.approved = true
          left outer join desired_locations as dl on s.id = dl.student_id
          left outer join project_media as pm on pm.id = (
            select project_media.id from project_media where project_media.project_id = p.id limit 1
          )
          ${
            search
              ? `where METAPHONE(LOWER(a.name), 2) = METAPHONE('${search}', 2)
              or LEVENSHTEIN(LOWER(ts_alias.skill), '${search}') < 4`
              : ""
          }
          ${determineQuery()}
          group by
            s.id,
            a.name,
            s.linkedin,
            s.github,
            s.twitter,
            s.profile_pic
            limit 8
            offset ${offset}`
      );
      resolve(students);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function getStudentCards({ offset = 0 }) {
  return new Promise(async (resolve, reject) => {
    try {
      const { rows: students } = await db.raw(
        `select s.id,
          a.name,
          s.location,
          s.lat,
          s.lon,
          s.profile_pic, 
          s.desired_title, 
          coalesce(jsonb_agg(distinct ts.skill) filter (where ts.skill is not null), '[]') as top_skills,
          coalesce(jsonb_agg(distinct sk.skill) filter (where sk.skill is not null), '[]') as skills, 
          coalesce(jsonb_agg(distinct jsonb_build_object('name', p.name, 'project_id', p.id, 'media', pm.media))
          filter (where p.name is not null), '[]') 
          as top_projects from accounts as a 
          inner join students as s on s.account_id = a.id and approved = true 
          left outer join tracks as t on s.track_id = t.id 
          left outer join top_skills as ts on s.id = ts.student_id 
          left outer join student_skills as sk on s.id = sk.student_id
          left outer join top_projects as tp on tp.student_id = s.id
          left outer join projects as p on p.id = tp.project_id and p.approved = true 
          left outer join project_media as pm on pm.id = ( select project_media.id from project_media where project_media.project_id = p.id limit 1) 
          group by s.id, a.name, s.linkedin, s.github, s.twitter, s.profile_pic, t.name 
          limit 8 offset ${offset}`
      );
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
      desired_locations,
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
            db.raw("array_agg(distinct ts.skill) as top_skills")
          )
          .leftOuterJoin("accounts as a", "a.id", "s.account_id")
          .leftOuterJoin("cohorts as c", "c.id", "s.cohort_id")
          .leftOuterJoin("tracks as t", "t.id", "s.track_id")
          .leftOuterJoin("student_skills as sk", "sk.student_id", "s.id")
          .leftOuterJoin("hobbies as h", "h.student_id", "s.id")
          .leftOuterJoin("top_skills as ts", "ts.student_id", "s.id")
          .groupBy("a.name", "s.id", "c.cohort_name", "t.name")
          .where({ "s.account_id": account_id })
          .first()
          .transacting(t);
        // console.log("STUDENT IN FETCH PROFILE BY ID", student);

        desired_locations = await db("desired_locations as dl")
          .select("lat", "location", "lon")
          .where({ "dl.student_id": student.id })
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
    if (!student.github) {
      resolve(
        getGitHubInfo(account_id, {
          track_options,
          cohort_options,
          id: student.id
        })
      );
    }
    resolve({
      ...student,
      desired_locations,
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

function deleteStudent(account_id) {
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

      //DELETE USER ON AUTH0
      const api = process.env.OAUTH_MGR_API;
      const url = `${api}users/${sub_id}`;
      const headers = {
        authorization: `Bearer ${access_token}`
      };

      const deleteResponse = await axios.delete(url, { headers });
      const finished = await db("accounts")
        .where({ id: account_id })
        .del();

      resolve(finished);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

//BACK BURNER
function getStudentLocations() {
  return db("students")
    .select("location", "lat as latitude", "lon as longitude")
    .whereNotNull("location")
    .whereNotNull("lat")
    .whereNotNull("lon");
}

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

        ],
        top_projects [

        ],
        projects [

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
            ...location,
            student_id: student.id
          }));
          await db("desired_locations")
            .where({ student_id: student.id })
            .del()
            .transacting(t);
          if (info.desired_locations[0].location) {
            desired_locations = await db("desired_locations")
              .insert(info.desired_locations, "*")
              .transacting(t);
          } else {
            desired_locations = [];
          }
        }

        let top_projects;
        if (info.top_projects && info.top_projects.length) {
          await db("top_projects")
            .where({ student_id: student.id })
            .del()
            .transacting(t);
          await db("top_projects")
            .insert(info.top_projects)
            .transacting(t);
          top_projects = await db("top_projects as tp")
            .select("p.*", db.raw("array_agg(distinct pm.media) as media"))
            .join("projects as p", "p.id", "tp.project_id")
            .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
            .where({ "tp.student_id": student.id })
            .groupBy("p.id")
            .transacting(t);
        }

        let projects;
        if (info.projects && info.projects.length) {
          await db("student_projects")
            .where({ student_id: student.id })
            .del()
            .transacting(t);
          await db("student_projects")
            .insert(info.projects)
            .transacting(t);
          projects = await db("student_projects as sp")
            .select("p.*", db.raw("array_agg(distinct pm.media) as media"))
            .join("projects as p", "p.id", "sp.project_id")
            .leftOuterJoin("project_media as pm", "pm.project_id", "p.id")
            .where({ "sp.student_id": student.id })
            .transacting(t)
            .groupBy("p.id");
        }

        updated = {
          name,
          ...student,
          hobbies,
          top_skills,
          skills,
          desired_locations,
          top_projects,
          projects
        };
      });
      resolve(updated);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function deleteProfilePicture(account_id, url) {
  return new Promise(async (resolve, reject) => {
    let student;
    try {
      await db.transaction(async t => {
        student = await db("students")
          .where({ profile_pic: url, account_id })
          .first()
          .transacting(t);
        console.log("STUDENT AFTER FIRST FETCH", student);

        if (student) {
          await db("students")
            .where({ profile_pic: url, account_id })
            .update({ profile_pic: null, cloudinary_id: null })
            .transacting(t);
        } else {
          throw new Error("Student could not be located.");
        }
      });
      console.log("STUDENT AFTER TX", student);
      console.log("STUDENT CLOUD ID", student.cloudinary_id);
      if (student.cloudinary_id) {
        console.log("CLOUD ID IS TRUE!");
        resolve(
          new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(
              student.cloudinary_id,
              (error, result) => {
                if (result) {
                  console.log("RESULT TRUE", result);
                  resolve();
                } else {
                  console.log("ERROR IN CLOUD DELETE", error);
                  reject(error);
                }
              }
            );
          })
        );
      }
      console.log("CLOUD ID WAS NOT TRUE");
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
