package com.plus33.europe.global.dto;

import java.io.Serializable;

public class ChatRequestDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String message;

    // Constructors
    public ChatRequestDTO() {}

    public ChatRequestDTO(String message) {
        this.message = message;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
