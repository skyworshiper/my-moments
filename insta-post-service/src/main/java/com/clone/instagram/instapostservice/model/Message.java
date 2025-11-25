package com.clone.instagram.instapostservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    @CreatedDate
    private Instant createdAt;

    @NonNull
    private String conversationKey;

    @NonNull
    private String senderUsername;

    @NonNull
    private String receiverUsername;

    @NonNull
    private String content;
}

