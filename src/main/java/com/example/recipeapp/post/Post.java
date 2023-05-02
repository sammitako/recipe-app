package com.example.recipeapp.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
@Document(collection="post")
public class Post {
    @Id
    private String id;
    private String userId;
    private String title;
    private String content;
    private Category category;
    private List<String> ingredients;
    private String photoUrl;
    private Date createdAt;
}
