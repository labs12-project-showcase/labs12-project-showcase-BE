const router = require("express").Router();

const actions = require("./login");
const generateToken = require("../../auth/token-handlers").generateToken;

router.route("/").post(async (req, res) => {
  const info = req.body;
  console.log("INFO IN REQ", info);
  try {
    const user = await actions.findUser(info.sub_id);
    if (user) {
      console.log("User exists");
      const token = generateToken(user);
      res.status(200).json(token);
    } else {
      console.log("Try adding user");
      const [newUser] = await actions.registerUser(info);
      console.log("Made new user", newUser);
      const token = generateToken(newUser);
      res.status(201).json(token);
    }
  } catch (err) {
    console.log("ERROR", err);
    res.status(500).json({ message: "Something went wrong logging in." });
  }
});

module.exports = router;
