package com.clone.instagram.instapostservice.payload;

import com.clone.instagram.instapostservice.model.Message;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class MessageResponse {
    private String id;
    private String senderUsername;
    private String receiverUsername;
    private String content;
    private Instant createdAt;

    public static MessageResponse from(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderUsername(message.getSenderUsername())
                .receiverUsername(message.getReceiverUsername())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}

