## About The Project
Recipe app is a platform where users can upload their recipes and search for recipes posted by other users.

### Built With
- Spring Boot
- Next.js
- NextAuth.js
- MongoDB
- Material UI

## Getting Started
1. Docker should be installed on local machine.
    ```
    docker compuse up
    ```
    Make sure installed containers are running: `mongo_db` and `mongo_express`
   <br />

2. Create database called `recipe-api-db` at http://localhost:8081.
![img.png](img.png)
<br/>
3. Create the index on post and user fields:</br>
   1. Open your web browser and go to http://localhost:8081.
   2. Click on the `recipe-api-db`  database.
   3. Click on the `post` collection.
   4. Click on the `New Index` button.
   5. In the input field, replace the default value with the field and value pairs
      ```
      {
         "title": "text",
         "content": "text",
         "category": "text",
         "ingredients": "text"
      }
      ```
   6. Click `Save` button.
   7. Do the same with `user` collection as well.
      ```
      {
         "firstName": 1,
    	 "lastName": 1
      }
      ```