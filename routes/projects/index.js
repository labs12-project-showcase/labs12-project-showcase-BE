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
      const project = await actions.getProjectById(id);
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({
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
      res.status(500).json({
        message: `There was an error updating the project with ID ${id}.`
      });
    }
  });

router
  .route("/:id/media")
  .put(restricted(), cloudParser.single("image"), async (req, res) => {
    const { id } = req.params;
    try {
      if (req.file) {
        const info = {
          // regex checks for `http:` and, if present, replaces with `https:`
          media: {
            media: req.file.url.replace(/^http:/i, "https:"),
            cloudinary_id: req.file.public_id
          }
        };
        const updated = await actions.updateProject(id, info);
        res.status(200).json(updated);
      } else {
        res.status(400).json({ message: "Please provide an image to upload." });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong uploading the picture." });
    }
  });

router.route("/:id/media/remove").put(restricted(), async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  try {
    await actions.deleteProjectImage(id, url);
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong deleting the project image." });
  }
});

router.route("/:id/leave").put(restricted(), async (req, res) => {
  const info = req.body;
  try {
    await actions.leaveProject(info);
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error leaving the project." });
  }
});

router.route("/:id/join").put(restricted(), async (req, res) => {
  const info = req.body;
  try {
    await actions.joinProject(info);
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error joining the project." });
  }
});
