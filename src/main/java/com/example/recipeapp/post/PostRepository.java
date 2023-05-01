package com.example.recipeapp.post;

import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
//    @Query("{ $text: { $search: ?0 } }")
//    List<Post> findByKwd(String kwd);
    List<Post> findByKwd(TextCriteria textCriteria);
}
