const router = require("express").Router();

const accountsActions = require("./accounts");
const studentsActions = require("./students");
const cohortsActions = require("./cohorts");

const resources = {
  accounts: {
    get: accountsActions.getAccounts,
    update: accountsActions.updateAccount,
    remove: accountsActions.deleteAccount
  },
  students: {
    get: studentsActions.getStudents,
    update: studentsActions.updateStudent,
    remove: studentsActions.deleteStudent
  },
  cohorts: {
    create: cohortsActions.addCohort,
    get: cohortsActions.getCohorts,
    update: cohortsActions.updateCohort,
    remove: cohortsActions.deleteCohort,
    requirements: info => info.cohort_name && info.cohort_type_id
  }
};

router
  .route("/:resource")
  .get(async (req, res) => {
    try {
      const resource = await resources[req.params.resource].get();
      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({
        message: `There was an error retrieving the ${req.params.resource}.`
      });
    }
  })
  .post(async (req, res) => {
    const info = req.body;

    if (resources[req.params.resource].requirements(info)) {
      try {
        const resource = await resources[req.params.resource].create(info);
        res.status(201).json(resource);
      } catch (error) {
        res.status(500).json({
          message: `Something went wrong trying to add the ${
            req.params.resource
          }.`
        });
      }
    } else {
      res.status(400).json({ message: "Please provide all required fields." });
    }
  });

router
  .route("/:resource/:id")
  .put(async (req, res, next) => {
    const { id } = req.params;
    const info = req.body;

    try {
      const resource = await resources[req.params.resource].update(id, info);
      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({
        message: `There was an error updating the ${req.params.resource}.`
      });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    try {
      await resources[req.params.resource].remove(id);
      res.status(200).end();
    } catch (error) {
      res.status(500).json({
        message: `Something went wrong deleting the ${req.params.resource}.`
      });
    }
  });

module.exports = router;
