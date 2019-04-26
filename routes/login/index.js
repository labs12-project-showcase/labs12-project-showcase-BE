const router = require("express").Router();

const actions = require("./login");
const generateToken = require("../../auth/token-handlers").generateToken;

router.route("/").post(async (req, res) => {
  const info = req.body;
  try {
    const user = await actions.findUser(info.sub_id);
    if (user) {
      const token = generateToken(user);
      res.status(200).json(token);
    } else {
      const newUser = await actions.registerUser(info);
      const acccess_token = await actions.getAPIToken();
      const userInfo = await actions.getUserInfo(acccess_token, info.sub_id);
      const token = generateToken(newUser);
      res.status(201).json({ token, userInfo });
    }
  } catch (err) {
    console.log("ERROR", err);
    res.status(500).json({ message: "Something went wrong logging in." });
  }
});

module.exports = router;
