package com.clone.instagram.instapostservice.repository;

import com.clone.instagram.instapostservice.model.PostComment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostCommentRepository extends MongoRepository<PostComment, String> {

    List<PostComment> findByPostIdOrderByCreatedAtAsc(String postId);

    long countByPostId(String postId);
}

