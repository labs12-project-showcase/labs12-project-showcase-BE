const router = require("express").Router();

const actions = require("./account");

router
  .route("/update")
  .get(async (req, res) => {
    const account_id = req.token.subject;

    try {
      const account = await actions.getAccount(account_id);
      res.status(200).json(account);
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong retrieving account information."
      });
    }
  })
  .put(async (req, res) => {
    const info = req.body;
    const { role_id, verified_student, ...filteredInfo } = info;
    const account_id = req.token.subject;

    try {
      const updated = await actions.updateAccount(account_id, filteredInfo);
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong update the user information." });
    }
  })
  .delete(async (req, res) => {
    try {
      res.status(200).end();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong deleting the account." });
    }
  });

module.exports = router;
