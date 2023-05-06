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
        if (userRepository.existsById(user.getId())) {
            return userRepository.save(user);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + user.getId());
        }
    }

    public User updateUserProfileImgUrl(String id, Map<String, Object> updates) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (updates.containsKey("profileImgUrl")) {
                user.setProfileImgUrl((String) updates.get("profileImgUrl"));
            }
            return userRepository.save(user);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + id);
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
