package com.plus33.europe.global.model;

import java.io.Serializable;

public class ChatResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String reply;

    public ChatResponse() {}

    public ChatResponse(String reply) {
        this.reply = reply;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}
