package com.clone.instagram.instapostservice.service;

import com.clone.instagram.instapostservice.exception.ResourceNotFoundException;
import com.clone.instagram.instapostservice.model.Post;
import com.clone.instagram.instapostservice.model.PostComment;
import com.clone.instagram.instapostservice.model.PostLike;
import com.clone.instagram.instapostservice.payload.CommentRequest;
import com.clone.instagram.instapostservice.payload.CommentResponse;
import com.clone.instagram.instapostservice.payload.PostReactionsResponse;
import com.clone.instagram.instapostservice.repository.PostCommentRepository;
import com.clone.instagram.instapostservice.repository.PostLikeRepository;
import com.clone.instagram.instapostservice.repository.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PostReactionService {

    @Autowired private PostRepository postRepository;
    @Autowired private PostLikeRepository postLikeRepository;
    @Autowired private PostCommentRepository postCommentRepository;

    public PostReactionsResponse likePost(String postId, String username) {
        Post post = getPost(postId);

        if(postLikeRepository.existsByPostIdAndUsername(postId, username)) {
            log.info("user {} already liked post {}", username, postId);
            return buildResponse(post, username);
        }

        PostLike like = PostLike.builder()
                .postId(postId)
                .username(username)
                .createdAt(Instant.now())
                .build();

        postLikeRepository.save(like);

        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);

        return buildResponse(post, username);
    }

    public PostReactionsResponse unlikePost(String postId, String username) {
        Post post = getPost(postId);

        postLikeRepository.findByPostIdAndUsername(postId, username)
                .ifPresent(like -> {
                    postLikeRepository.delete(like);
                    post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
                    postRepository.save(post);
                });

        return buildResponse(post, username);
    }

    public PostReactionsResponse addComment(String postId, String username, CommentRequest request) {
        Post post = getPost(postId);

        PostComment comment = PostComment.builder()
                .postId(postId)
                .username(username)
                .text(request.getText())
                .createdAt(Instant.now())
                .build();

        postCommentRepository.save(comment);

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        return buildResponse(post, username);
    }

    public PostReactionsResponse getReactions(String postId, String username) {
        Post post = getPost(postId);
        return buildResponse(post, username);
    }

    private Post getPost(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException(postId));
    }

    private PostReactionsResponse buildResponse(Post post, String username) {
        List<CommentResponse> comments = postCommentRepository.findByPostIdOrderByCreatedAtAsc(post.getId())
                .stream()
                .map(comment -> CommentResponse.builder()
                        .id(comment.getId())
                        .username(comment.getUsername())
                        .text(comment.getText())
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        boolean likedByUser = postLikeRepository.existsByPostIdAndUsername(post.getId(), username);

        return PostReactionsResponse.builder()
                .postId(post.getId())
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .liked(likedByUser)
                .comments(comments)
                .build();
    }
}

