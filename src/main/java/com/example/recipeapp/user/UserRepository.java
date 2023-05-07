package com.example.recipeapp.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
//    @Query("{$or:[{'firstName':{$regex:?0,$options:'i'}},{'lastName':{$regex:?1,$options:'i'}}]}")
//    List<User> findByFirstNameRegexOrLastNameRegex(String firstName, String lastName);
    @Query("{'$or': [{'firstName': {$regex: ?0, $options: 'i'}, 'lastName': {$regex: ?1, $options: 'i'}}, {'email': {$regex: ?2, $options: 'i'}}]}")
    List<User> findByFullNameRegexOrEmailRegex(String firstNameRegex, String lastNameRegex, String emailRegex);

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
