package com.clone.instagram.instapostservice.repository;

import com.clone.instagram.instapostservice.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findByConversationKeyOrderByCreatedAtAsc(String conversationKey);

    List<Message> findTop100BySenderUsernameOrReceiverUsernameOrderByCreatedAtDesc(String sender, String receiver);
}

