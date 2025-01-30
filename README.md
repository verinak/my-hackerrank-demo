# RankHacker - A Mini Problem-Solving Web App

<!-- <img src="imgs/rh_logo.png" alt="Project Logo" width="200"><br/> -->
<div align="center">
    <img src="imgs/rh_white.png" alt="RankHacker Logo" width="400px"><br/>
</div>

## Not HackerRank
This started out as an assignment to model the HackerRank database in mongodb, and later extended with an ExpressJS API and interface.

The client side is still under development.

<!-- TODO -->
<!-- ## Features

-  -->

## API

The API allows users to perform CRUD operations on the "HackerRank" database. 

### Base URL
http://localhost:3000/

### Authentication
This API uses bearer token for authentication and authorization.<br/>
The signin/signup endpoints provide a bearer token that is required for interacting with most other endpoints.


### Endpoints

### Users Endpoints

| Description               | URL                            | Method   | Authorization  |
|-------------------------- |--------------------------------|----------|----------------|
| **Get All Users**         | `/users/`                      | `GET`   | Admin Only |
| **User Sign Up**          | `/users/new`                   | `POST`  | - |
| **User Log In**           | `/users/registered`            | `POST`  | - |
| **Get User Data**         | `/users/registered`            | `GET`   | Logged In |
| **Change Password**       | `/users/registered`            | `PATCH` | Logged In |
| **Get User Submissions**  | `/users/registered/submissions` | `GET`   | Logged In |

---

### Problems Endpoints

| Description                 | URL                            | Method   | Authorization  | Query Parameters |
|-----------------------------|--------------------------------|----------|----------------|------------------|
| **Create New Problem**      | `/problems/`                   | `POST`  | Admin Only |
| **Get Problems**            | `/problems/`                   | `GET`   | Logged In | `topic`
| **Get Problem Details**     | `/problems/:id/`               | `GET`   | Logged In |
| **Update Problem**          | `/problems/:id/`               | `PUT`   | Admin Only |
| **Delete Problem**          | `/problems/:id/`               | `DELETE` | Admin Only |
| **Get Problem Submissions** | `/problems/:id/submissions`    | `GET`   | Logged In |
| **Submit a Solution**       | `/problems/:id/submissions`    | `POST`  | Logged In |

### Response Format
The response body follows the following structure. The response includes the status code, requested data (for GET requests), a success or error message, and a success flag.

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
<!-- TODO -->
<!-- 
### Status Codes

-  -->

