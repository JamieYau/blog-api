# Blog API

## Project Overview

This is a Full Stack Blog Project with three separate components:

- [**Backend (API):**](https://github.com/JamieYau/blog-api) Provides RESTful endpoints for posts and comments.
- [**Client:**](https://github.com/JamieYau/blog-client) A user-facing application for viewing and interacting with blog posts and comments.
- [**CMS:**](https://github.com/JamieYau/blog-cms) An administrative interface for managing posts and comments.

### Links

- Blog Client website : https://blog-client-kappa-seven.vercel.app/
- Blog CMS website: https://blog-cms-beryl-sigma.vercel.app/

## Description

## API Documentation

### Auth Routes

- POST /api/auth/register: Register a new user
- POST /api/auth/login: Login a user

### Post Routes

- GET /api/posts: Get all posts
- GET /api/posts/:id: Get a post by ID
- POST /api/posts: Create a new post
- PUT /api/posts/:id: Update a post by ID
- DELETE /api/posts/:id: Delete a post by ID

### Comment Routes

- GET /api/posts/:postId/comments: Get all comments for a post
- POST /api/posts/:postId/comments: Create a new comment
- PUT /api/comments/:id: Update a comment by ID
- DELETE /api/comments/:id: Delete a comment by ID

### Users Routes

- GET /api/users: Get all users
- GET /api/users/:id: Get a user by ID
- PUT /api/users/:id: Update a user by ID
- DELETE /api/users/:id: Delete a user by ID

## Technologies Used

- Node.js
- Express
- MongoDB with Mongoose
- BcryptJs
- Express validator
- Json Web Tokens
- sanitize-html
