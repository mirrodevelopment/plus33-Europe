package com.plus33.europe.global.controller;

import com.plus33.europe.global.dto.JournalStoryDTO;
import com.plus33.europe.global.service.JournalStoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
public class JournalRestController {

    private final JournalStoryService journalStoryService;

    @Autowired
    public JournalRestController(JournalStoryService journalStoryService) {
        this.journalStoryService = journalStoryService;
    }

    @GetMapping("/stories")
    public ResponseEntity<List<JournalStoryDTO>> getAllStories() {
        List<JournalStoryDTO> stories = journalStoryService.getAllStories();
        return new ResponseEntity<>(stories, HttpStatus.OK);
    }
}

