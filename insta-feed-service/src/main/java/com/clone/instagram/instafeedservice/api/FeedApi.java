package com.clone.instagram.instafeedservice.api;

import com.clone.instagram.instafeedservice.model.Post;
import com.clone.instagram.instafeedservice.payload.SlicedResult;
import com.clone.instagram.instafeedservice.service.FeedService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@Slf4j
public class FeedApi {

    @Autowired private FeedService feedService;

    @GetMapping({"/feed/{username}", "/{username}"})
    public ResponseEntity<?> getFeed(
            @PathVariable String username,
            @RequestParam(value = "ps",required = false) Optional<String> pagingState) {

        log.info("fetching feed for user {} isFirstPage {}",
                username, pagingState.isEmpty());

        try {
            return ResponseEntity.ok(feedService.getUserFeed(username, pagingState));
        } catch (Exception e) {
            log.error("Error fetching feed for user: {}", username, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch feed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
}
