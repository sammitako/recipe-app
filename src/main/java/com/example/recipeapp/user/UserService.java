package com.example.recipeapp.user;

import com.example.recipeapp.exception.ResourceNotFoundException;
import com.example.recipeapp.post.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User createUserIfNotExists(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        } else {
            return userRepository.save(user);
        }
    }
    public User updateUser(User user) {
        // Check if the user exists before trying to update it
        Optional<User> optionalUser = userRepository.findById(user.getId());
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            // Update the firstName and lastName only if they are not null
            if (user.getFirstName() != null) {
                existingUser.setFirstName(user.getFirstName());
            }
            if (user.getLastName() != null) {
                existingUser.setLastName(user.getLastName());
            }

            // Update the profileImgUrl only if it's not null
            if (user.getProfileImgUrl() != null) {
                existingUser.setProfileImgUrl(user.getProfileImgUrl());
            }

            return userRepository.save(existingUser);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + user.getId());
        }
    }
    // For Profile.jsx
    public User updateUserNames(String userId, Map<String, Object> updates) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (updates.containsKey("firstName")) {
                user.setFirstName((String) updates.get("firstName"));
            }
            if (updates.containsKey("lastName")) {
                user.setLastName((String) updates.get("lastName"));
            }
            return userRepository.save(user);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
    }

    // For Feed.jsx
    public User updateUserProfileImgUrl(String userId, Map<String, Object> updates) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (updates.containsKey("profileImgUrl")) {
                user.setProfileImgUrl((String) updates.get("profileImgUrl"));
            }
            return userRepository.save(user);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
    }

    public void deleteUserById(String userId) {
        // Check if the post exists before trying to delete it
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
        } else {
            throw new ResourceNotFoundException("User not found with id " + userId);
        }
    }

}
