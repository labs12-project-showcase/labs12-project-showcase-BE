const router = require("express").Router();
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const actions = require("./students");
const cloudParser = require("../../config/cloudinary");
const restricted = require("../../middleware/restricted");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.use(cors());

module.exports = router;

router.route("/cards").get(async (req, res) => {
  try {
    students = await actions.getStudentCards();
    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong retrieving the student cards." });
  }
});

router.route("/endorse/:id").post(restricted(), async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const account_id = req.token.subject;
  try {
    const endorsement = await actions.endorseStudent(account_id, id, message);
    res.status(201).json(endorsement);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong endorsing the student." });
  }
});

router.route("/profile").get(restricted(), async (req, res) => {
  const account_id = req.token.subject;
  const { update } = req.query;
  try {
    const profile = await actions.getStudentProfile(account_id, update);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile." });
  }
});

router.route("/profile/:id").get(async (req, res) => {
  const { id } = req.params;
  try {
    const student = await actions.getStudentById(id);
    if (student) {
      res.status(200).json(student);
    } else {
      res
        .status(404)
        .json({ message: "No student could be located with that ID." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong retrieving the student." });
  }
});

// router.route("/locations").get(async (req, res) => {
//   try {
//     const { rows: locations } = await actions.getStudentLocations();
//     res.status(200).json(locations);
//   } catch (error) {
//     res.status(500).json({
//       message: "Soemthing went wrong retrieving the student locations."
//     });
//   }
// });

router.route("/update").put(restricted(), async (req, res) => {
  const updates = req.body;
  console.log("UPDATES", updates);
  const account_id = req.token.subject;

  try {
    const updated = await actions.updateStudent(account_id, updates);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong updating the user information.",
      error
    });
  }
});

router
  .route("/update/profile_picture")
  .put(restricted(), cloudParser.single("image"), async (req, res) => {
    const account_id = req.token.subject;
    try {
      if (req.file && req.file.url) {
        const updated = await actions.updateStudent(account_id, {
          student: {
            profile_pic: req.file.url,
            cloudinary_id: req.file.public_id
          }
        });
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

router
  .route("/update/profile_picture/:url")
  .delete(restricted(), async (req, res) => {
    const account_id = req.token.subject;
    const { url } = req.params;
    try {
      await actions.deleteProfilePicture(account_id, url);
      res.status(204).end();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong removing the user image." });
    }
  });

router.route("/contact-me/:id").post(async (req, res) => {
  const msg = req.body;
  const { id } = req.params;

  try {
    const { email } = await actions.getStudentEmail(id);
    console.log("EMAIL", email);
    if (!email) {
      throw new Error("Email not found!");
    }
    const success = await sgMail.send({ ...msg, to: email });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not send the email." });
  }
});
