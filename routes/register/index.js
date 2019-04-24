const router = require("express").Router();

const actions = require("./register");

router.route("/").post(async (req, res) => {
  const user = req.body;
  if (
    user &&
    user.email &&
    user.password &&
    user.first_name &&
    user.last_name
  ) {
    try {
      await actions.addUser(user);
      res.status(201).json({ message: "User successfully added." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong adding the new user." });
    }
  } else {
    res.status(400).json({
      message:
        "Please provide an email, password, first name and last name for registration."
    });
  }
});

module.exports = router;
