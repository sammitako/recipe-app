package com.example.recipeapp.user;

import com.example.recipeapp.post.Category;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection="user")
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
    @Id
    private String id;
    @Nonnull
    private String firstName;
    @Nonnull
    private String lastName;
    @Indexed(unique = true)
    private String emailId;
}
