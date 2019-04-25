const router = require("express").Router();

const actions = require("./login");
const generateToken = require("../../auth/token-handlers").generateToken;

router.route("/").post(async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Something went wrong logging in." });
  }
});

module.exports = router;
