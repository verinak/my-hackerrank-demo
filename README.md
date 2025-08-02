# RankHacker - A Mini Problem-Solving Web App

<!-- <img src="imgs/rh_logo.png" alt="Project Logo" width="200"><br/> -->
<div align="center">
    <img src="imgs/rh_white.png" alt="RankHacker Logo" width="400px"><br/>
</div>

A mini HackerRank clone, built using a MongoDB database, ExpressJS API, and Angular front-end.

Angular client side is still under development, because Angular is Hard®.


- [RankHacker - A Mini Problem-Solving Web App](#rankhacker---a-mini-problem-solving-web-app)
  - [API](#api)
    - [Base Information](#base-information)
    - [Authentication Endpoints](#authentication-endpoints)
      - [`POST /users/new` - User Sign Up](#post-usersnew---user-sign-up)
      - [`POST /users/registered` - User Log In](#post-usersregistered---user-log-in)
    - [User Endpoints](#user-endpoints)
      - [`GET /users/ ` - Get All Users](#get-users----get-all-users)
      - [`GET /users/registered ` - Get User Data](#get-usersregistered----get-user-data)
      - [`PATCH /users/registered ` - Change Password](#patch-usersregistered----change-password)
    - [Problems Endpoints](#problems-endpoints)
      - [`GET /problems ` - Get Problems](#get-problems----get-problems)
      - [`GET /problems/:id` - Get Problem Details](#get-problemsid---get-problem-details)
      - [`POST /problems/` - Create Problem](#post-problems---create-problem)
      - [`PUT /problems/:id` - Update Problem](#put-problemsid---update-problem)
      - [`DELETE /problems/:id` - Delete Problem](#delete-problemsid---delete-problem)
    - [Submissions Endpoints](#submissions-endpoints)
      - [`GET /users/registered/submissions ` - Get User Submissions](#get-usersregisteredsubmissions----get-user-submissions)
      - [`GET /problems/:id/submissions ` - Get Problem Submissions](#get-problemsidsubmissions----get-problem-submissions)
      - [`POST /problems/:id/submissions ` - Create a Submission](#post-problemsidsubmissions----create-a-submission)
    - [Response Format](#response-format)
    - [Other Possible Status Codes](#other-possible-status-codes)



## API

The API allows users to perform CRUD operations on the "HackerRank" database.

### Base Information
- **Base URL:** `http://localhost:3000/`
- **Content Type:** `application/json`
- **Authentication:** JWT Bearer Token (include token in header for endpoints that require authentication)

---

### Authentication Endpoints

#### `POST /users/new` - User Sign Up
Registers a new user and returns a token.

**Authorization:** None  

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Responses:**
- `200 OK`
  - Success (returns bearer token)
- `400 Bad Request`
  - Missing User Data
  - User Already Registered


#### `POST /users/registered` - User Log In
Authenticates a user and returns a token.

**Authorization:** None  

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Responses:**
- `200 OK`
  - Success (returns bearer token)
- `400 Bad Request`
  - Missing User Data
- `401 Unauthorized`
  - Invalid Password
- `404 Not Found`
  - User Not Registered

---


### User Endpoints

#### `GET /users/ ` - Get All Users
Returns a list of all users.

**Authorization:** Admin Only  

**Responses:**
- `200 OK`
  - Success (returns list of Users)
- `404 Not Found`
  - No users found in the database.

#### `GET /users/registered ` - Get User Data
Fetch the authenticated user's profile.

**Authorization:** Logged In

**Responses:**
- `200 OK`
  - Success (returns username and email)
- `404 Not Found`
  - User not found 


#### `PATCH /users/registered ` - Change Password
Change the authenticated user's password.

**Authorization:** Logged In

**Request Body:**
```json
{
  "password": "password123"
}
```

**Responses:**
- `200 OK`
  - Success
- `400 Bad Request`
  - New password not provided

---

### Problems Endpoints

#### `GET /problems ` - Get Problems
Get a list of all problems (filter by topic if needed).

**Authorization:** Logged In

**Query Parameters:**
  - topic (optional) - Filter problems by topic

**Responses:**
- `200 OK`
  - Success (return list of problems)
- `404 Not Found`
  - No problems in database


#### `GET /problems/:id` - Get Problem Details
Get details of a problem by id.

**Authorization:** Logged In

**Responses:**
- `200 OK`
  - Success (return problem id, content, difficulty, topic, test cases, user submissions, and number of times solved)
- `404 Not Found`
  - Problem not found


#### `POST /problems/` - Create Problem
Add a new problem to the database.

**Authorization:** Admin Only

**Request Body:**
```json
{
 "content": "Write a function that returns the sum of two numbers.",
  "difficulty": "easy",
  "topic": "python",
  "test_cases": [
    {
      "input": "2 3",
      "expected_output": "5"
    },
    {
      "input": "-1 4",
      "expected_output": "3"
    }
  ]
}
```

**Responses:**
- `201 Created`
  - Success (returns problem id)
- `400 Bad Request`
  - Invalid problem data


#### `PUT /problems/:id` - Update Problem
Edit existing problem data.

**Authorization:** Admin Only

**Request Body:**
```json
{
 "content": "Write a function that returns the sum of two numbers.",
  "difficulty": "easy",
  "topic": "javascript",
  "test_cases": [
    {
      "input": "2 3",
      "expected_output": "5"
    },
    {
      "input": "1 2",
      "expected_output": "3"
    }
  ]
}
```

**Responses:**
- `200 OK`
  - Success
- `400 Bad Request`
  - Invalid problem data


#### `DELETE /problems/:id` - Delete Problem
Delete problem from database.

**Authorization:** Admin Only

**Responses:**
- `200 OK`
  - Success
- `400 Bad Request`
  - Invalid problem data

---

### Submissions Endpoints

#### `GET /users/registered/submissions ` - Get User Submissions
Get a list of the registered user's submissions.

**Authorization:** Logged In


**Responses:**
- `200 OK`
  - Success (return list of submissions)
- `404 Not Found`
  - no submissions found


#### `GET /problems/:id/submissions ` - Get Problem Submissions
Get a list of all submissions to a problem.

**Authorization:** Logged In

**Responses:**
- `200 OK`
  - Success (return list of submissions)
- `404 Not Found`
  - no submissions found

#### `POST /problems/:id/submissions ` - Create a Submission
Submit a solution to a problem.

**Authorization:** Logged In

**Request Body:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": {
    "name": "javascript",
    "version": "ES6"
  }
}
```

**Responses:**
- `201 Created`
  - Success (return submission id)
- `400 Bad Request`
  - Invalid submission data
  - Invalid problem id

---

### Response Format
The response body follows the following structure. The response includes 4 fields: `status` (the status code), `data` (requested data, for GET requests), `message` (a success or error message), and `success` (a success flag).

GET  `/users/registered`

```json
{
  "status": 200,
  "data": {
    "username": "verinak",
    "email": "verinamichelk@gmail.com"
  },
  "message": "Success",
  "success": true
}
```
```json
{
  "status": 401,
  "message": "Access denied. No token provided.",
  "success": false
}
```

### Other Possible Status Codes
- `401 Unauthorized`
  - Missing token
- `403 Forbidden`
  - Invalid token
  - Access denied (admin routes)
- `405 Method Not Allowed`
  - Method not allowed for this route
- `500 Internal Server Error`
  - API error




