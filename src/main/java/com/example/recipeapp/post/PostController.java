package com.example.recipeapp.post;

import com.example.recipeapp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(value="http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PostController {
    private final PostService postService;

    @GetMapping(value="/posts")
    @CrossOrigin
    public ResponseEntity<List<PostDTO>> getPosts() {
        return ResponseEntity.ok(postService.getPosts());
    }

    @GetMapping("/post/{postId}")
    @CrossOrigin
    public ResponseEntity<PostDTO> searchPostById(@PathVariable String postId) {
        return ResponseEntity.ok(postService.searchPostById(postId));
    }
    @PatchMapping("/updatePostsUserDetails/{userId}")
    @CrossOrigin
    public ResponseEntity<String> updatePostsUserDetails(
            @PathVariable String userId,
            @RequestBody Map<String, String> userDetails
    ) {
        String firstName = userDetails.get("firstName");
        String lastName = userDetails.get("lastName");
        String profileImgUrl = userDetails.get("profileImgUrl");

        postService.updatePostsUserDetails(userId, firstName, lastName, profileImgUrl);

        return ResponseEntity.ok("Posts user details updated successfully");
    }
    @GetMapping("/search")
    @CrossOrigin
    public ResponseEntity<List<PostDTO>> searchPosts(
            @RequestParam(required = false) String kwd) { // http://localhost:8080/api/v1/search?kwd=searchingText
        return ResponseEntity.ok(postService.searchPosts(kwd));
    }

    @PostMapping("/createPost")
    @CrossOrigin
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.createPost(post));
    }
    @PutMapping("/updatePost")
    @CrossOrigin
    public ResponseEntity<Post> updatePost(
            @RequestBody Post post
    ) {
        return ResponseEntity.ok(postService.updatePost(post));
    }

    @PutMapping("/updatePost/{postId}")
    @CrossOrigin
    public ResponseEntity<?> updatePost(@PathVariable String postId, @RequestBody Post post) {
        try {
            Post updatedPost = postService.updatePostById(postId, post);
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deletePost/{postId}")
    @CrossOrigin
    public ResponseEntity<String> deletePost(@PathVariable String postId) {
        boolean isDeleted = postService.deletePostById(postId);
        if (isDeleted) {
            return ResponseEntity.accepted().body("Post deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found with id " + postId);
        }
    }

}
