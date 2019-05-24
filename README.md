# Lambda Showcase — Backend

#### Backend Deployment: https://halg-backend.herokuapp.com/
#### Frontend Documentation: https://github.com/labs12-project-showcase/labs12-project-showcase-FE

## Endpoints

#### Login Routes — `/routes/login`

| Method | Endpoint          | Access Control | Description                                                                                                                                                  |
| ------ | ----------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `api/auth/login/` | public         | If user exists and login is successful, returns a JWT for the user.<br>If user doesn't exist, registers user and, if successful, returns a JWT for the user. |

#### Admin Routes — `/routes/admin`

All Admin Routes require a valid JWT with a role of `staff` in the `authorization` header of the request. Authenticating as an admin generates such a JWT automatically.

| Method       | Endpoint                  | Successful Response                                            |
| ------------ | ------------------------- | -------------------------------------------------------------- |
| **ACCOUNTS** |                           |                                                                |
| GET          | `/api/admin/accounts`     | `200` Returns array of all student records                     |
| PUT          | `/api/admin/accounts/:id` | `200` Modifies an existing student record                      |
| DELETE       | `/api/admin/accounts/:id` | `204` Deletes a student record                                 |
| **COHORTS**  |                           |                                                                |
| GET          | `/api/admin/cohorts`      | `200` Returns array of all cohorts                             |
| PUT          | `/api/admin/cohorts/:id`  | `200` Modifies an existing cohort                              |
| DELETE       | `/api/admin/cohorts/:id`  | `204` Deletes a cohort                                         |
| **PROJECTS** |                           |                                                                |
| GET          | `/api/admin/projects`     | `200` Returns array of all student projects                    |
| PUT          | `/api/admin/projects/:id` | `200` Modifies an existing project record                      |
| DELETE       | `/api/admin/projects/:id` | `204` Deletes a project record                                 |
| **STUDENTS** |                           |                                                                |
| GET          | `/api/admin/students`     | `200` Returns array of all student records                     |
| PUT          | `/api/admin/students/:id` | `200` Modifies an existing student, returns the updated record |
| DELETE       | `/api/admin/students/:id` | `204` Deletes student record                                   |
| **TRACKS**   |                           |                                                                |
| GET          | `/api/admin/tracks`       | `200` Returns data for all tracks                              |
| POST         | `/api/admin/tracks`       | `201` Adds a new track, returns new track record               |
| PUT          | `/api/admin/tracks/:id`   | `200` Modifies an existing track                               |
| DELETE       | `/api/admin/tracks/:id`   | `204` Deletes a track                                          |

#### Projects Routes — `/routes/projects`

| Method      | Endpoint                         | Successful Response                                                                                       |
| ----------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **PUBLIC**  |                                  |                                                                                                           |
| GET         | `/api/projects`                  | `200` Returns array of 8 most recent project cards                                                        |
| GET         | `/api/projects/:id`              | `200` Returns a project record                                                                            |
| **PRIVATE** |                                  |                                                                                                           |
| POST        | `/api/projects`                  | `201` Adds project, returns new project record                                                            |
| PUT         | `/api/projects/:id`              | `200` Updates a project record, returns updated record                                                    |
| PUT         | `/api/projects/:id/join`         | `204` Adds a student to a project                                                                         |
| PUT         | `/api/projects/:id/leave`        | `204` Removes student from project, deletes project if no students remain on project                      |
| PUT         | `/api/projects/:id/media`        | `200` Takes an image, saves it via Cloudinary, adds URL to project record, returns updated project record |
| PUT         | `/api/projects/:id/media/remove` | `204` Deletes an image from a project and from Cloudinary                                                 |

#### Students Routes — `/routes/students`

| Method      | Endpoint                                      | Successful Response                                                                                                   |
| ----------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **PUBLIC**  |                                               |                                                                                                                       |
| GET         | `/api/students`                               | `200` Returns array of 8 most recent project cards                                                                    |
| GET         | `/api/students/cards`                         | `200` Returns array of 8 most recent project cards                                                                    |
| GET         | `/api/students/profile/:id`                   | `200` Returns profile record for student ID                                                                           |
| GET         | `/api/students/locations`                     | `200` Returns array of student locations                                                                              |
| **PRIVATE** |                                               |                                                                                                                       |
| POST        | `/api/students`                               | `200` Returns array of 8 most recent project cards                                                                    |
| POST        | `/api/students/endorse/:id`                   | `201` Returns array of 8 most recent project cards                                                                    |
| GET         | `/api/students/profile`                       | `200` Returns profile record for student in supplied JWT                                                              |
| PUT         | `/api/students/update`                        | `200` Updates a student and returns updated student record                                                            |
| DELETE      | `/api/students/delete`                        | `202` Deletes a student record and returns a delete message                                                           |
| PUT         | `/api/students/update/profile_picture`        | `200` Takes an image, saves image via Cloudinary, updates student record with URL, and returns updated student record |
| PUT         | `/api/students/update/profile_picture/remove` | `204` Removes image from student record and deletes image on Cloudinary                                               |
| PUT         | `/api/students/contact-me/:id`                | `204` Takes a message and attempts to send it to the email of the student associated with the `:id`                   |

