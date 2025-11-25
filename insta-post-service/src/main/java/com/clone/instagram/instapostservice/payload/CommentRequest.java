package com.clone.instagram.instapostservice.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class CommentRequest {

    @NotBlank
    @Size(max = 500)
    private String text;
}

