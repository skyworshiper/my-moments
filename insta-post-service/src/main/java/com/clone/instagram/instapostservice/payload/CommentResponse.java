package com.clone.instagram.instapostservice.payload;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CommentResponse {

    private String id;
    private String username;
    private String text;
    private Instant createdAt;
}

