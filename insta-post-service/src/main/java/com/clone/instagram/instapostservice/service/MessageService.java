package com.clone.instagram.instapostservice.service;

import com.clone.instagram.instapostservice.model.Message;
import com.clone.instagram.instapostservice.payload.ConversationSummary;
import com.clone.instagram.instapostservice.payload.MessageResponse;
import com.clone.instagram.instapostservice.payload.SendMessageRequest;
import com.clone.instagram.instapostservice.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageResponse sendMessage(String senderUsername, SendMessageRequest request) {
        String receiver = request.getReceiverUsername();
        String content = request.getContent() == null ? "" : request.getContent().trim();

        Message message = Message.builder()
                .conversationKey(buildConversationKey(senderUsername, receiver))
                .senderUsername(senderUsername)
                .receiverUsername(receiver)
                .content(content)
                .build();

        Message saved = messageRepository.save(message);
        log.info("user {} sent a message to {}", senderUsername, receiver);
        return MessageResponse.from(saved);
    }

    public List<MessageResponse> getConversation(String currentUser, String otherUser) {
        return messageRepository
                .findByConversationKeyOrderByCreatedAtAsc(buildConversationKey(currentUser, otherUser))
                .stream()
                .map(MessageResponse::from)
                .collect(Collectors.toList());
    }

    public List<ConversationSummary> getConversationSummaries(String currentUser) {
        List<Message> recentMessages = messageRepository
                .findTop100BySenderUsernameOrReceiverUsernameOrderByCreatedAtDesc(currentUser, currentUser);

        Map<String, ConversationSummary> summaries = new LinkedHashMap<>();

        for (Message message : recentMessages) {
            String partner = message.getSenderUsername().equalsIgnoreCase(currentUser)
                    ? message.getReceiverUsername()
                    : message.getSenderUsername();
            String key = buildConversationKey(currentUser, partner);

            if (!summaries.containsKey(key)) {
                summaries.put(key, ConversationSummary.builder()
                        .username(partner)
                        .lastMessage(message.getContent())
                        .lastMessageAt(message.getCreatedAt())
                        .build());
            }
        }

        return new ArrayList<>(summaries.values());
    }

    private String buildConversationKey(String usernameA, String usernameB) {
        String normalizedA = usernameA.toLowerCase(Locale.ROOT);
        String normalizedB = usernameB.toLowerCase(Locale.ROOT);

        if (normalizedA.compareTo(normalizedB) <= 0) {
            return normalizedA + "#" + normalizedB;
        }

        return normalizedB + "#" + normalizedA;
    }
}

