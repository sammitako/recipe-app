package com.example.recipeapp.post;

import com.example.recipeapp.exception.ResourceNotFoundException;
import com.example.recipeapp.user.User;
import com.example.recipeapp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    public List<Post> getPosts() {
        return postRepository.findAll();
    }

    public Post searchPostById(String postId) {
        return postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post with id: [" + postId + "] not found"));
    }

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


    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Post post) {
        System.out.println(post);  // print out the Post object
        // Check if the post exists before trying to update it
        if (postRepository.existsById(post.getId())) {
            return postRepository.save(post);
        } else {
            throw new ResourceNotFoundException("Post not found with id: " + post.getId());
        }
    }

    public void deletePostById(String postId) {
        // Check if the post exists before trying to delete it
        if (postRepository.existsById(postId)) {
            postRepository.deleteById(postId);
        } else {
            throw new ResourceNotFoundException("Post not found with id " + postId);
        }
    }

}
