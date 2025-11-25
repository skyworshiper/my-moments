package com.clone.instagram.instapostservice.repository;

import com.clone.instagram.instapostservice.model.PostLike;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PostLikeRepository extends MongoRepository<PostLike, String> {

    Optional<PostLike> findByPostIdAndUsername(String postId, String username);

    boolean existsByPostIdAndUsername(String postId, String username);

    long countByPostId(String postId);

    List<PostLike> findByPostIdInAndUsername(List<String> postIds, String username);
}

