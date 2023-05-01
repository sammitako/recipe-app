package com.example.recipeapp.user;

import com.example.recipeapp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        // Check if the post exists before trying to update it
        if (userRepository.existsById(user.getId())) {
            return userRepository.save(user);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + user.getId());
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
