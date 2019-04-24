const db = require("../../data/config");

module.exports = {
  addTrack,
  deleteTrack,
  getTracks,
  updateTrack
};

function addTrack(info) {
  return new Promise(async (resolve, reject) => {
    try {
      const [res] = await db("tracks").insert(info, "*");
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}

function deleteTrack(id) {
  return db("tracks")
    .where({ id })
    .del();
}

function getTracks() {
  return db("tracks");
}

function updateTrack(id, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const [res] = await db("tracks")
        .where({ id })
        .update(info, "*");
      resolve(res);
    } catch (error) {
      reject();
    }
  });
}
