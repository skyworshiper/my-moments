package com.clone.instagram.instapostservice.payload;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PostReactionsResponse {

    private String postId;
    private long likeCount;
    private long commentCount;
    private boolean liked;
    private List<CommentResponse> comments;
}

