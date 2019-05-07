const db = require("../../data/config");

module.exports = {
  search
};

function search(track) {
  return db("students")
  .join("tracks", "tracks.id", "students.track_id")
  .where({ "tracks.id": track });
}