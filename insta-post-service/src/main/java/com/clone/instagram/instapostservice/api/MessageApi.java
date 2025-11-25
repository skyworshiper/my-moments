package com.clone.instagram.instapostservice.api;

import com.clone.instagram.instapostservice.payload.ConversationSummary;
import com.clone.instagram.instapostservice.payload.MessageResponse;
import com.clone.instagram.instapostservice.payload.SendMessageRequest;
import com.clone.instagram.instapostservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageApi {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@AuthenticationPrincipal Principal principal,
                                                       @Valid @RequestBody SendMessageRequest request) {
        log.info("user {} sending a message to {}", principal.getName(), request.getReceiverUsername());
        return ResponseEntity.ok(messageService.sendMessage(principal.getName(), request));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummary>> getConversationSummaries(@AuthenticationPrincipal Principal principal) {
        log.info("listing conversations for user {}", principal.getName());
        return ResponseEntity.ok(messageService.getConversationSummaries(principal.getName()));
    }

    @GetMapping("/conversations/{username}")
    public ResponseEntity<List<MessageResponse>> getConversation(@AuthenticationPrincipal Principal principal,
                                                                 @PathVariable("username") String username) {
        log.info("retrieving conversation between {} and {}", principal.getName(), username);
        return ResponseEntity.ok(messageService.getConversation(principal.getName(), username));
    }
}

