package com.clone.instagram.instapostservice.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class SendMessageRequest {

    @NotBlank
    private String receiverUsername;

    @NotBlank
    @Size(max = 2000)
    private String content;
}

