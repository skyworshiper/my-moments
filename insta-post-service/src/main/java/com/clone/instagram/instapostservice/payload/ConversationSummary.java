package com.clone.instagram.instapostservice.payload;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ConversationSummary {
    private String username;
    private String lastMessage;
    private Instant lastMessageAt;
}

