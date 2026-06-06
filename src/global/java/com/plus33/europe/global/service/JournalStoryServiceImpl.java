package com.plus33.europe.global.service;

import com.plus33.europe.global.dto.JournalStoryDTO;
import com.plus33.europe.global.model.JournalStory;
import com.plus33.europe.global.repository.JournalStoryRepository;
import com.plus33.europe.global.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JournalStoryServiceImpl implements JournalStoryService {

    private final JournalStoryRepository journalStoryRepository;

    @Autowired
    public JournalStoryServiceImpl(JournalStoryRepository journalStoryRepository) {
        this.journalStoryRepository = journalStoryRepository;
    }

    @Override
    public List<JournalStoryDTO> getAllStories() {
        List<JournalStory> stories = journalStoryRepository.findAll();
        return stories.stream()
                .map(DtoMapper::toJournalStoryDto)
                .collect(Collectors.toList());
    }
}
