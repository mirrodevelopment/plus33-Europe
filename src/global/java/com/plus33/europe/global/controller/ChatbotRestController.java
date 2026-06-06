package com.plus33.europe.global.controller;

import com.plus33.europe.global.dto.ChatRequestDTO;
import com.plus33.europe.global.dto.ChatResponseDTO;
import com.plus33.europe.global.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotRestController {

    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotRestController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/ask")
    public ResponseEntity<ChatResponseDTO> askAssistant(@RequestBody ChatRequestDTO request) {
        ChatResponseDTO response = chatbotService.getAssistantReply(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

