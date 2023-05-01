package com.example.recipeapp.post;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.io.IOException;
import java.util.List;

@RestController
public class PostController {
    @Autowired
    PostRepository postRepository;
//    @ApiIgnore
//    @RequestMapping(value="/")
//    public void redirect(HttpServletResponse response) throws IOException {
//        response.sendRedirect("/swagger-ui.html");
//    }
    @GetMapping(value="/api/v1/getPosts")
    public List<Post> getPosts() {
        return postRepository.findAll();
    }

    @PostMapping("/api/v1/createPost")
    public Post createPost(@RequestBody Post post) {
        return postRepository.save(post);
    }
}
