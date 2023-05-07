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

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    public List<PostResponse> getPosts() {
        List<Post> posts = postRepository.findAll();

        List<PostResponse> postResponses = posts.stream().map(post -> {
            PostResponse.PostResponseBuilder builder = PostResponse.builder()
                    .id(post.getId())
                    .userId(post.getUserId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .category(post.getCategory())
                    .ingredients(post.getIngredients())
                    .coverImgUrl(post.getCoverImgUrl())
                    .createdAt(post.getCreatedAt());

            userRepository.findById(post.getUserId()).ifPresent(user -> {
                builder.userFirstName(user.getFirstName());
                builder.userLastName(user.getLastName());
                builder.userProfileImgUrl(user.getProfileImgUrl());
            });

            return builder.build();
        }).collect(Collectors.toList());

        // Sort the post responses by createdAt in descending order
        postResponses = postResponses.stream()
                .sorted(Comparator.comparing(PostResponse::getCreatedAt).reversed())
                .collect(Collectors.toList());

        return postResponses;
    }

    public void updatePostsUserDetails(String userId, String firstName, String lastName, String profileImgUrl) {
        List<Post> posts = postRepository.findByUserId(userId);

        posts.forEach(post -> {
            post.setUserFirstName(firstName);
            post.setUserLastName(lastName);
            post.setUserProfileImgUrl(profileImgUrl);
        });

        postRepository.saveAll(posts);
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
//        List<User> users = userRepository.findByFirstNameRegexOrLastNameRegex(kwd, kwd);

        // Split the keyword into first name and last name
        String[] nameParts = kwd.split("\\s+");
        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        // Search in User collection
        List<User> users = userRepository.findByFullNameRegexOrEmailRegex(kwd, firstName, lastName, kwd);

        // Get the userIds of the matching users
        List<String> userIds = users.stream().map(User::getId).collect(Collectors.toList());

        // Add any posts written by the matching users to the posts list
        posts.addAll(postRepository.findByUserIdIn(userIds));

        return new ArrayList<>(posts);
    }


    public Post createPost(Post post) {
        Optional<User> userOptional = userRepository.findById(post.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            post.setUserFirstName(user.getFirstName());
            post.setUserLastName(user.getLastName());
            post.setUserProfileImgUrl(user.getProfileImgUrl());
        }
        return postRepository.save(post);
    }

    public Post updatePost(Post post) {
        System.out.println(post);
        // Check if the post exists before trying to update it
        if (postRepository.existsById(post.getId())) {
            return postRepository.save(post);
        } else {
            throw new ResourceNotFoundException("Post not found with id: " + post.getId());
        }
    }

    public Post updatePostById(String postId, Post post) {
        try {
            Optional<Post> optionalPost = postRepository.findById(postId);
            if (optionalPost.isPresent()) {
                Post existingPost = optionalPost.get();
                existingPost.setTitle(post.getTitle());
                existingPost.setCategory(post.getCategory());
                existingPost.setIngredients(post.getIngredients());
                existingPost.setContent(post.getContent());
                existingPost.setCoverImgUrl(post.getCoverImgUrl());
                return postRepository.save(existingPost);
            } else {
                throw new ResourceNotFoundException("Post not found with id: " + postId);
            }
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while updating the post", e);
        }
    }

    public boolean deletePostById(String postId) {
        // Check if the post exists before trying to delete it
        if (postRepository.existsById(postId)) {
            postRepository.deleteById(postId);
            return true;
        } else {
            return false;
        }
    }

}
