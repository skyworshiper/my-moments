package com.clone.instagram.instapostservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "post_likes")
public class PostLike {

    @Id
    private String id;

    @Indexed
    private String postId;

    @Indexed
    private String username;

    @CreatedDate
    private Instant createdAt;
}

