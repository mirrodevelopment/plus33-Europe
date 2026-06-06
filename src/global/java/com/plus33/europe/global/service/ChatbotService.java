package com.plus33.europe.global.service;

import com.plus33.europe.global.dto.ChatRequestDTO;
import com.plus33.europe.global.dto.ChatResponseDTO;

public interface ChatbotService {
    ChatResponseDTO getAssistantReply(ChatRequestDTO request);
}
