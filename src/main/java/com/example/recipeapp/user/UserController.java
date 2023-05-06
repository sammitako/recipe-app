package com.example.recipeapp.user;
import com.example.recipeapp.post.Post;
import com.mongodb.DuplicateKeyException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(value="http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping(value="/users")
    @CrossOrigin
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    @GetMapping("/userById/{userId}")
    @CrossOrigin
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/userByEmail/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.findUserByEmail(email);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/createUser")
    @CrossOrigin
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User savedUser = userRepository.save(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (DuplicateKeyException e) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while saving the user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/updateUser")
    @CrossOrigin
    public ResponseEntity<User> updateUser(
            @RequestBody User user
    ) {
        return ResponseEntity.ok(userService.updateUser(user));
    }

    @DeleteMapping("/deleteUser/{userId}")
    @CrossOrigin
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUserById(userId);
        return ResponseEntity.accepted().build();
    }
}
