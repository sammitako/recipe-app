package com.example.recipeapp.post;

import java.util.Date;
import java.util.List;

public class PostDTO {
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

    // Generate getters, setters, and constructors for the fields


    public PostDTO(String id, String userId, String userFirstName, String userLastName, String userProfileImgUrl, String title, String content, Category category, List<String> ingredients, String coverImgUrl, Date createdAt) {
        this.id = id;
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.userProfileImgUrl = userProfileImgUrl;
        this.title = title;
        this.content = content;
        this.category = category;
        this.ingredients = ingredients;
        this.coverImgUrl = coverImgUrl;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserFirstName() {
        return userFirstName;
    }

    public void setUserFirstName(String userFirstName) {
        this.userFirstName = userFirstName;
    }

    public String getUserLastName() {
        return userLastName;
    }

    public void setUserLastName(String userLastName) {
        this.userLastName = userLastName;
    }

    public String getUserProfileImgUrl() {
        return userProfileImgUrl;
    }

    public void setUserProfileImgUrl(String userProfileImgUrl) {
        this.userProfileImgUrl = userProfileImgUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public String getCoverImgUrl() {
        return coverImgUrl;
    }

    public void setCoverImgUrl(String coverImgUrl) {
        this.coverImgUrl = coverImgUrl;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}