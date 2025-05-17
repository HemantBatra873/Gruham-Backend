# Gruham Backend

Gruham is a full-stack real estate marketplace web application. This repository contains the backend code for Gruham, built using Node.js, Express.js, MongoDB, and Firebase. It provides RESTful APIs for user authentication (including Google OAuth), listings management, and user profile operations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Why MongoDB](#why-mongodb)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [Auth APIs](#auth-apis)
  - [User APIs](#user-apis)
  - [Listing APIs](#listing-apis)
- [Error Handling](#error-handling)
- [Authentication Middleware](#authentication-middleware)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- User authentication with email/password and Google OAuth
- Protected routes using JWT authentication
- Listing creation, update, deletion, and querying
- User-specific listing management
- Filtered and paginated listing search
- Error handling and role-based access

## Tech Stack

| Technology     | Purpose                                                 |
|----------------|---------------------------------------------------------|
| Node.js        | JavaScript runtime environment for building the backend |
| Express.js     | Web framework to manage routing and middleware          |
| MongoDB        | NoSQL database to store user and listing data           |
| Mongoose       | ODM to simplify interactions with MongoDB               |
| JWT            | Authentication using JSON Web Tokens                    |
| Firebase       | For image hosting and optionally Google OAuth           |
| bcryptjs       | For securely hashing user passwords                     |
| dotenv         | Environment variable management                         |

## Why MongoDB

MongoDB is used as the primary database because:

- It provides a flexible document-based schema suitable for real estate listings with varying attributes.
- It integrates seamlessly with JavaScript using Mongoose ODM.
- It offers scalability and performance for read/write-heavy applications.
- It allows fast development and schema evolution, ideal for MVP and prototyping stages.

## Project Structure

```
api/
├── controllers/       # Route handlers
│   ├── auth-controller.js
│   ├── user-controller.js
│   └── listing-controller.js
├── models/            # Mongoose schemas
│   ├── user-model.js
│   └── listing-model.js
├── routes/            # Express route definitions
│   ├── auth-routes.js
│   ├── user-routes.js
│   └── listing-routes.js
├── utils/             # Utility functions
│   ├── error.js
│   └── verifyUser.js
```

## API Endpoints

### Auth APIs

| Method | Endpoint       | Description               |
|--------|----------------|---------------------------|
| POST   | `/api/auth/signup` | Register a new user       |
| POST   | `/api/auth/login`  | Login with email/password |
| POST   | `/api/auth/google` | Login via Google OAuth    |
| GET    | `/api/auth/logout` | Clear token and logout    |

### User APIs

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/api/user/test`    | Test endpoint                      |
| POST   | `/api/user/update/:id` | Update user info                |
| DELETE | `/api/user/delete/:id` | Delete user account             |
| GET    | `/api/user/listings/:id` | Get all listings by user       |
| GET    | `/api/user/:id`     | Get user info (excluding password) |

### Listing APIs

| Method | Endpoint           | Description                      |
|--------|--------------------|----------------------------------|
| POST   | `/api/listing/create` | Create a new listing (auth required) |
| DELETE | `/api/listing/delete/:id` | Delete a listing (auth and owner required) |
| POST   | `/api/listing/update/:id` | Update listing (auth and owner required) |
| GET    | `/api/listing/get/:id` | Fetch specific listing by ID     |
| GET    | `/api/listing/get`  | Get listings (filter and paginate) |

#### Listing Query Parameters

Supports filtering by:

- `searchTerm`
- `offer`
- `furnished`
- `parking`
- `type` ("sale" or "rent")
- `limit`, `startIndex`, `sort`, `order`

## Error Handling

A custom error handler (`utils/error.js`) is used across controllers:

```js
export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
```

This enables centralized handling and consistent HTTP responses.

## Authentication Middleware

JWT-based middleware ensures secure access to protected routes:

```js
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, 'Unauthorized'));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));
    req.user = user;
    next();
  });
};
```

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/HemantBatra873/Gruham-Backend.git
cd gruham-backend
```

2. Install dependencies:

```bash
npm install
```

3. Add environment variables:

Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Run the server:

```bash
npm run dev
```

## Environment Variables

| Key           | Description                       |
|---------------|-----------------------------------|
| PORT          | Port number the server runs on    |
| MONGODB_URI   | MongoDB connection string         |
| JWT_SECRET    | Secret key for signing JWT tokens |

## License

This project is licensed under the MIT License.

## Maintainer

Gruham Backend is built and maintained by Hemant Batra. Feel free to open issues or contribute!
