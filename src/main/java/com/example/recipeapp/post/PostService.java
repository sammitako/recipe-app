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

    public List<Post> searchPosts(String kwd) {
        // If no keyword is provided, return all posts.
        if (kwd == null || kwd.isEmpty()) {
            return postRepository.findAll();
        }

        // Split the keyword by space to separate potential first and last names.
        String[] nameParts = kwd.split(" ");
        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        // Build a TextCriteria that will be used to search across multiple fields.
        TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matching(kwd);

        // Find all User objects that match the firstName and lastName criteria.
        List<User> users = findUsersByFirstAndLastName(firstName, lastName);

        // Extract user ids from the list of User objects.
        List<String> userIds = users.stream().map(User::getId).collect(Collectors.toList());

        // Find all Post objects that match the textCriteria.
        List<Post> allPosts = postRepository.findByKwd(textCriteria);

        // Filter the posts to include only those with a user with the specified userIds or matching the keyword.
        List<Post> filteredPosts = allPosts.stream()
                .filter(post -> userIds.contains(post.getUserId()) || post.getTitle().contains(kwd) ||
                        post.getCategory().toString().contains(kwd) || post.getIngredients().contains(kwd))
                .collect(Collectors.toList());

        return filteredPosts;
    }

    private List<User> findUsersByFirstAndLastName(String firstName, String lastName) {
        if (firstName == null || firstName.isEmpty()) {
            firstName = ".*"; // Match any firstName if not provided.
        } else {
            firstName = "(?i)" + firstName; // Make regex case-insensitive.
        }

        if (lastName == null || lastName.isEmpty()) {
            lastName = ".*"; // Match any lastName if not provided.
        } else {
            lastName = "(?i)" + lastName; // Make regex case-insensitive.
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
