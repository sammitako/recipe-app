package com.example.recipeapp.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class PostResponse {
    private String id;
    private String userId;
    private String userFirstName;
    private String userLastName;
    private String userProfileImgUrl;
    private String title;
    private String content;
    private Category category;
    private List<String> ingredients;
    private String coverImgUrl;
    private Date createdAt;
}