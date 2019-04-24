const router = require("express").Router();

const actions = require("./projects");
const cloudParser = require("../../config/cloudinary");
const restricted = require("../../middleware/restricted");

module.exports = router;

router
  .route("/")
  .get(async (req, res) => {
    try {
      const projects = await actions.getProjectCards();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving projects." });
    }
  })
  .post(restricted(), async (req, res) => {
    const info = req.body;

    try {
      const project = await actions.createProject(info);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Error creating a new project." });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;

    try {
      const project = actions.getProjectById(id);
      res.status(200).json(project);
    } catch (error) {
      res
        .status(500)
        .json({
          message: `Error retrieving the project with the ID of ${id}.`
        });
    }
  })
  .put(restricted(), async (req, res) => {
    const info = req.body;
    const { id } = req.params;
    try {
      const project = await actions.updateProject(id, info);
      res.status(200).json(project);
    } catch (error) {
      res
        .status(500)
        .json({
          message: `There was an error updating the project with ID ${id}.`
        });
    }
  });
