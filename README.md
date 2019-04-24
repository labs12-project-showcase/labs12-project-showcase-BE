# Hire A Lambda Grad

## Navigation

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

## Base URL

**https://halg-backend.herokuapp.com/**

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
