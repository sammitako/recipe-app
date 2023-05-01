package com.example.recipeapp.post;

import com.example.recipeapp.exception.ResourceNotFoundException;
import com.example.recipeapp.user.User;
import com.example.recipeapp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<Post> getPosts() {
        return postRepository.findAll();
    }

    public Post searchPostById(String postId) {
        return postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post with id: [" + postId + "] not found"));
    }

    public List<Post> searchPosts(String kwd, String firstName, String lastName) {
        // If none of the search parameters are provided, return all posts.
        if ((kwd == null || kwd.isEmpty()) && (firstName == null || firstName.isEmpty()) && (lastName == null || lastName.isEmpty())) {
            return postRepository.findAll();
        }

        // Build a TextCriteria that will be used to search across multiple fields.
        TextCriteria textCriteria = TextCriteria.forDefaultLanguage();

        if (kwd != null && !kwd.isEmpty()) {
            textCriteria.matching(kwd);
        }

        // Find all User objects that match the firstName and lastName criteria.
        List<User> users = findUsersByFirstAndLastName(firstName, lastName);

        // Extract user ids from the list of User objects.
        List<String> userIds = users.stream().map(User::getId).collect(Collectors.toList());

        // Find all Post objects that match the textCriteria.
        List<Post> allPosts = postRepository.findByKwd(textCriteria);

        // Filter the posts to include only those with a user with the specified userIds.
        List<Post> filteredPosts = allPosts.stream()
                .filter(post -> userIds.contains(post.getUserId()))
                .collect(Collectors.toList());

        return filteredPosts;
    }

    private List<User> findUsersByFirstAndLastName(String firstName, String lastName) {
        if (firstName == null || firstName.isEmpty()) {
            firstName = ".*"; // Match any firstName if not provided.
        }

        if (lastName == null || lastName.isEmpty()) {
            lastName = ".*"; // Match any lastName if not provided.
        }

        // Use regex to find users with matching firstName and lastName.
        List<User> users = userRepository.findByFirstNameRegexAndLastNameRegex(firstName, lastName);
        return users;
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Post post) {
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
