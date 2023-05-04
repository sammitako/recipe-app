package com.example.recipeapp.post;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
@CrossOrigin(value="http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class CategoryController {
    @GetMapping("/categories")
    public List<String> getCategories() {
        return Arrays.stream(Category.values())
                .map(Category::getCategory)
                .collect(Collectors.toList());
    }
}