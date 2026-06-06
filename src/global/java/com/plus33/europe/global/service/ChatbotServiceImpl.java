package com.plus33.europe.global.service;

import com.plus33.europe.global.dto.ChatRequestDTO;
import com.plus33.europe.global.dto.ChatResponseDTO;
import com.plus33.europe.global.constants.AppConstants;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    @Override
    public ChatResponseDTO getAssistantReply(ChatRequestDTO request) {
        String userMessage = request.getMessage();
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return new ChatResponseDTO(AppConstants.CHATBOT_DEFAULT_GREETING);
        }

        String msg = userMessage.toLowerCase(Locale.ROOT);
        String reply;

        if (msg.contains("franchise") || msg.contains("partner") || msg.contains("apply")) {
            reply = AppConstants.CHATBOT_REPLY_FRANCHISE;
        } else if (msg.contains("store") || msg.contains("buy") || msg.contains("price") || msg.contains("shop")) {
            reply = AppConstants.CHATBOT_REPLY_STORE;
        } else if (msg.contains("location") || msg.contains("find") || msg.contains("where") || msg.contains("paris") || msg.contains("map")) {
            reply = AppConstants.CHATBOT_REPLY_LOCATION;
        } else if (msg.contains("coffee") || msg.contains("roast") || msg.contains("brew")) {
            reply = AppConstants.CHATBOT_REPLY_COFFEE;
        } else if (msg.contains("hello") || msg.contains("hi") || msg.contains("bonjour")) {
            reply = AppConstants.CHATBOT_REPLY_HELLO;
        } else {
            reply = AppConstants.CHATBOT_REPLY_FALLBACK;
        }

        return new ChatResponseDTO(reply);
    }
}
