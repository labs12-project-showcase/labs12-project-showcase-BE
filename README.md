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


### All Accounts

[Register User](#register)<br>
[Login](#login)<br>
[Get All Students - Card Form](#get-students)<br>
[Get Student Locations](#get-student-locations)<br>
[Get Single Student](#get-single-student)<br>
[Delete An Account](#delete-account)<br>

### Student Accounts

[Update Student Information](#edit-student)<br>

### Admin Accounts

[Get All Students](#admin-get-students)<br>
[Update Single Student](#admin-update-student)<br>
[Delete Single Student](#admin-delete-student)<br><br>
[Get All Cohorts](#admin-get-cohorts)<br>
[Add A Cohort](#admin-add-cohort)<br>
[Update A Cohort](#admin-update-cohort)<br>
[Delete A Cohort](#admin-delete-cohort)<br><br>
[Get All Accounts](#admin-get-accounts)<br>
[Update An Account](#admin-update-account)<br>
[Remove An Account](#admin-remove-account)<br>


---

## REGISTER <a name="register"></a>

### Register an Account

_Method URL: /api/auth/register_

_HTTP method: [POST]_

### Headers

| name         | type   | required | description              |
| ------------ | ------ | -------- | ------------------------ |
| Content-Type | String | Yes      | Must be application/json |

### Body

| name       | type    | required | description           |
| ---------- | ------- | -------- | --------------------- |
| username   | String  | Yes      | Must be unique        |
| email      | String  | Yes      | Must be unique        |
| first_name | String  | Yes      |                       |
| last_name  | String  | Yes      |                       |
| password   | String  | Yes      |                       |
| role_id    | Integer | Yes      | [Role ID](#get-roles) |

_example:_

```
{
  username: "johndoe",
  password: "password123",
  email: "johndoe@email.com",
  first_name: "john",
  last_name: "doe",
  role_id: 1
}
```

### Response

**201 (OK)**

> If you successfully register a user the endpoint will return an HTTP response with a status code 201 and a body as below.

```
{
 "message": "User successfully added."
}
```

**400 (Bad Request)**

> If you send in invalid fields, the endpoint will return an HTTP response with a status code 400 and a body as below.

```
{
  "error": true,
  "message": "Please provide a username, password, first name, last name, and email for registration."
}
```

> If the account already exists, the endpoint will return an HTTP response with a status code 400 and a body as below.

```
{
    "message": "The user already exists."
}
```

---

## LOGIN <a name="login"></a>

### Logs a user in

_Method Url: /api/auth/login_

_HTTP method: [POST]_

### Body

| name     | type   | required | description                               |
| -------- | ------ | -------- | ----------------------------------------- |
| email    | String | Yes      | Must match corresponding account email    |
| password | String | Yes      | Must match corresponding account password |

_example:_

```
{
  "email": "johndoe@email.com",
  "password": "password123"
}
```

### Response

**200 (OK)**

> If you successfully login, the endpoint will return an HTTP response with a status code 200 and a body as below.

```
{
  "token": "hashed_token_here",
  "message": "Welcome!"
}
```

**401 (Unauthorized)**

> If you send in invalid fields or the passwords do not match, the endpoint will return an HTTP response with a status code 400 and a body as below.

```
{
  "message": "There was a problem with your request."
}
```

**400 (Bad Request)**

> If you send in a form with no email or password. You will receive an HTTP error with a status code 400 and the body below.

```
{
"message": "Please provide the username and password."
}
```

---

# STUDENTS ROUTES

## GET ALL STUDENTS <a name="get-students"></a>

### Retrieves an array of all of the students, in card format.

_Method URL: /students/cards_

_HTTP method: [GET]_

### Response

**200 (OK)**

> Will return an array of students with information relevant to card displays.

```
[
  {
    "id": 2,
    "profile_pic": "http://res.cloudinary.com/hirelambdastudents/image/upload/v1554688170/pictures/z9uohrxrlcjvhw2jwqqm.jpg",
    "location": 77433,
    "relocatable": 1,
    "website": "testing",
    "github": "test",
    "linkedin": "test2",
    "twitter": "test1",
    "careers_approved": 0,
    "first_name": "billy",
    "last_name": "bill",
    "cohort_name": "Web16"
  }
]
```

## GET STUDENT LOCATIONS <a name="get-students"></a>

### Retrieves an array of all of the student locations, and job searching status.

_Method URL: /students/locations_

_HTTP method: [GET]_

### Response

**200 (OK)**

> Will return an array of students with information relevant to location mapping.

```
[
  {
      "location": 77433,
      "job_searching": 1
  }
]
```

## GET STUDENT LOCATIONS <a name="get-student-locations"></a>

### Retrieves an array of all of the student locations, and job searching status.

_Method URL: /students/locations_

_HTTP method: [GET]_

### Response

**200 (OK)**

> Will return an array of students with information relevant to location mapping.

```
[
  {
      "location": 77433,
      "job_searching": 1
  }
]
```

## GET SINGLE STUDENT <a name="get-single-student"></a>

### Retrieves an object with information relevant to a student profile page.

_Method URL: /students/profile/:id_

_HTTP method: [GET]_

### Response

**200 (OK)**

> Will return an object for the student matching the ID provided.

```
[
  {
    "profile_pic": "http://res.cloudinary.com/hirelambdastudents/image/upload/v1554688170/pictures/z9uohrxrlcjvhw2jwqqm.jpg",
    "location": "houston, tx",
    "relocatable": 1,
    "about": "super awesome developer",
    "job_searching": 1,
    "careers_approved": 0,
    "did_pm": 1,
    "website": "testing",
    "github": "test",
    "linkedin": "test2",
    "twitter": "test1",
    "first_name": "brandon",
    "last_name": "gardner",
    "cohort_name": "Web16"
  }
]
```

**404 (NOT FOUND)**

> If you put in an invalid ID, the server will respond with the following.

```
{
    "message": "No student could be located with that ID."
}
```

## UPDATE STUDENT INFO <a name="edit-student"></a>

### Update's current student's information with new values. Did PM and Careers Approved not available.

_Method URL: /students/update_

_HTTP method: [PUT]_

### Headers

| name          | type   | required | description                |
| ------------- | ------ | -------- | -------------------------- |
| authorization | String | Yes      | Token to reference account |

### Response

**200 (OK)**

> Will return a status code 200 and an object with updated student.

```
{
  "cohort_id": 1,
  "profile_pic": "http://res.cloudinary.com/hirelambdastudents/image/upload/v1554688170/pictures/z9uohrxrlcjvhw2jwqqm.jpg",
  "location": "77433",
  "relocatable": 1,
  "about": "super awesome developer",
  "job_searching": 1,
  "website": "testing",
  "github": "test",
  "linkedin": "test2",
  "twitter": "test1"
}
```

## DELETE ACCOUNT <a name="delete-account"></a>

### Removes account from records. NOT REVERSIBLE.

_Method URL: /students/update_

_HTTP method: [DELETE]_

### Headers

| name          | type   | required | description                |
| ------------- | ------ | -------- | -------------------------- |
| authorization | String | Yes      | Token to reference account |

### Response

**200 (OK)**

> Will return a status code 200 if account was successfully deleted.
