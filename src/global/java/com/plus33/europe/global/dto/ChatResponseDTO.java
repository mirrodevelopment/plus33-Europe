package com.plus33.europe.global.dto;

import java.io.Serializable;

public class ChatResponseDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String reply;

    // Constructors
    public ChatResponseDTO() {}

    public ChatResponseDTO(String reply) {
        this.reply = reply;
    }

    // Getters and Setters
    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
}
