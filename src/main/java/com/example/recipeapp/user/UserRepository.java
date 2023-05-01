package com.example.recipeapp.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    List<User> findByFirstNameRegexAndLastNameRegex(String firstNameRegex, String lastNameRegex);

}
