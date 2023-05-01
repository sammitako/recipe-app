package com.example.recipeapp.post;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PostController {
    private final PostService postService;

    @GetMapping(value="/posts")
    public ResponseEntity<List<Post>> getPosts() {
        return ResponseEntity.ok(postService.getPosts());
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<Post> searchPostById(@PathVariable String postId) {
        return ResponseEntity.ok(postService.searchPostById(postId));
    }

    @GetMapping("/posts")
    @CrossOrigin
    public ResponseEntity<List<Post>> searchPosts(@RequestParam(required = false) String kwd,
                                                  @RequestParam(required = false) String firstName,
                                                  @RequestParam(required = false) String lastName) {
        return ResponseEntity.ok(postService.searchPosts(kwd, firstName, lastName));
    }

    @PostMapping("/createPost")
    @CrossOrigin
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.createPost(post));
    }
    @PostMapping("/updatePost")
    public ResponseEntity<Post> updatePost(
            @RequestBody Post post
    ) {
        return ResponseEntity.ok(postService.updatePost(post));
    }

    @DeleteMapping("/deletePost/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId) {
        postService.deletePostById(postId);
        return ResponseEntity.accepted().build();
    }
}
