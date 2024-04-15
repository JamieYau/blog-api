# Blog API

user Postman to test API endpoints

## TODO
1. user controller auth
2. add checks for creating user
   - no duplicate username
   - min & max length
   - invalid characters
3. express-validator
4. checks for posts and comments like length of content
5. get post by id should have access to all posts that are published
   - caveat that if current user == author then can also view unpublished
