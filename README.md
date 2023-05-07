# About The Final Project
Recipe app is a platform where users can upload their recipes and search for recipes posted by other users.

### Features
- Login and logout (Facebook, Google)
  - Unique email is required.
  - Profile picture on app first reflects to those two providers' profile images when registered.
    - However, if admin change image deliberately on database, it will reflect current profileImgUrl data from database.
    - Yet, if profileImgUrl is empty, it will reflect two providers' profile images. 
- Update my account
  - Firstname, Lastname only
  - Profile picture will be updated when profile images from  those two provider updated.
  - Updates are applied to related posts as well.
- Create my recipes
  - Title, Category, Ingredients, Recipe method, Cover image are required. (form validation)
  - Category data is provided from backend.
  - Ingredients are made from users and stored in mongoDB. (some are provided from frontend)
- Update my recipes (restricted to my post only)
- Delete my recipes (restricted to my post only)
- View only my recipes or every recipe
- Search recipes by author or post
  - with post indexed (title, category, ingredients, recipe method)
  - with user indexed (firstname, lastname, full-name)

### Built With
- Framework: Spring Boot, Next.js (React)
- Database: MongoDB
- Environment: Docker
- Hosting: Local server
- Software architectural style: REST APIs
- Libraries: NextAuth.js, Cloudinary, Material UI
- Project management tool: Maven, Git
- IDE: intelliJ IDEA, VSCode


## Getting Started
1. Docker should be installed on local machine.
    ```shell
   # Under root directory
    docker compose up
    ```
   Make sure installed containers are running: `mongo_db` and `mongo_express`
2. Go to `client` directory.
    ```shell
    yarn
    yarn dev
   # http://localhost:3000
    ```
3. Create database called `recipe-api-db` at http://localhost:8081.
4. Create the index on post and user fields:</br>
      1) Open your web browser and go to http://localhost:8081.
      2) Click on the `recipe-api-db`  database.
      3) Click on the `post` collection.
      4) Click on the `New Index` button.
      5) In the input field, replace the default value with the field and value pairs
         ```json
         {
            "title": "text",
            "content": "text",
            "category": "text",
            "ingredients": "text"
         }
         ```
      6) Click `Save` button.
      7) Do the same with `user` collection as well.
         ```json
         {
            "firstName": 1,
            "lastName": 1
         }
         ```
## About MongoDB Search
1. <strong>Stop Words</strong> <br />MongoDB's full-text search feature ignores certain common words known as stop words (like "is", "on", "the", "a", etc.). These are words that appear frequently in text and are not useful for search. This might be the reason why searching for "only" is not returning any results.
<br />

2. <strong>Tokenization</strong><br /> MongoDB breaks down (tokenizes) strings into individual words based on language-specific rules. For languages that use space-delimited words (like English), MongoDB tokenizes the string at whitespace and most punctuation. MongoDB's text search may not work as expected with numbers, especially if they are included in text strings.
<br />

3. <strong>Case Sensitivity</strong><br /> By default, MongoDB's text search is case-insensitive. It also diacritic-insensitive (it treats characters with diacritical marks as their base character). This means a search for "Korean" would also match "korean". However, in your example, "30" and "only" should be matched as they are.

### 1. MongoDB's full-text search
MongoDB's full-text search does not always work with numbers especially if they are embedded within text strings.
```java
public List<Post> searchPosts(String kwd) {
      TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matching(kwd);
      Query query = TextQuery.queryText(textCriteria).sortByScore();
      
      // Search in Post collection
      List<Post> posts = mongoTemplate.find(query, Post.class);
      
      // Search in User collection
      List<User> users = userRepository.findByFirstNameRegexOrLastNameRegex(kwd, kwd);
      
      // Get the userIds of the matching users
      List<String> userIds = users.stream().map(User::getId).collect(Collectors.toList());
      
      // Add any posts written by the matching users to the posts list
      posts.addAll(postRepository.findByUserIdIn(userIds));
      
      return posts;
}
```

### 2. MongoDB's `$regex` operator
MongoDB's `$regex` operator provides more granular control over text search. However, $regex can be slower than $text because it doesn't make use of MongoDB's text index. This may be slower than the MongoDB's full-text search and may not scale well with large collections.

```java
public List<Post> searchPosts(String kwd) {
      // Create a regex pattern for the keyword
      Pattern pattern = Pattern.compile(kwd, Pattern.CASE_INSENSITIVE);
      
      // Create queries for each field
      Query titleQuery = new Query(Criteria.where("title").regex(pattern));
      Query contentQuery = new Query(Criteria.where("content").regex(pattern));
      Query categoryQuery = new Query(Criteria.where("category").regex(pattern));
      Query ingredientsQuery = new Query(Criteria.where("ingredients").regex(pattern));
      
      // Execute the queries
      List<Post> titlePosts = mongoTemplate.find(titleQuery, Post.class);
      List<Post> contentPosts = mongoTemplate.find(contentQuery, Post.class);
      List<Post> categoryPosts = mongoTemplate.find(categoryQuery, Post.class);
      List<Post> ingredientsPosts = mongoTemplate.find(ingredientsQuery, Post.class);
      
      // Merge the result lists
      Set<Post> posts = new HashSet<>();
      posts.addAll(titlePosts);
      posts.addAll(contentPosts);
      posts.addAll(categoryPosts);
      posts.addAll(ingredientsPosts);
      
      // Search in User collection
      List<User> users = userRepository.findByFirstNameRegexOrLastNameRegex(kwd, kwd);
      
      // Get the userIds of the matching users
      List<String> userIds = users.stream().map(User::getId).collect(Collectors.toList());
      
      // Add any posts written by the matching users to the posts list
      posts.addAll(postRepository.findByUserIdIn(userIds));
      
      return new ArrayList<>(posts);
}
```