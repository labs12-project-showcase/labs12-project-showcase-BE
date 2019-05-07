const router = require("express").Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const actions = require("./search.js");

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

module.exports = router;

router.route("/").get(async (req, res) => {
  const { track } = req.query;
  try {
    const students = await actions.search(track);
    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong retrieving the students." });
  }
});