package com.plus33.europe.global.model;

import java.io.Serializable;

public class ChatRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String message;

    public ChatRequest() {}

    public ChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
