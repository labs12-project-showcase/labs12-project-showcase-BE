const router = require("express").Router();
const bcrypt = require("bcryptjs");

const actions = require("./login");
const generateToken = require("../../auth/token-handlers").generateToken;

router.route("/").post(async (req, res) => {
  let { email, password } = req.body;
  if (email && password) {
    try {
      const user = await actions.findUser(email);
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({ message: "Welcome!", token });
      } else {
        res.status(401).json({ message: "Invalid credentials." });
      }
    } catch (err) {
      res.status(500).json({ message: "Something went wrong logging in." });
    }
  } else {
    res
      .status(400)
      .json({ message: "Please provide the username and password." });
  }
});

module.exports = router;
