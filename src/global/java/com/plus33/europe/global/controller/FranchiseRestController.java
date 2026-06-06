package com.plus33.europe.global.controller;

import com.plus33.europe.global.dto.FranchiseApplicationDTO;
import com.plus33.europe.global.service.FranchiseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/franchise")
public class FranchiseRestController {

    private static final Logger logger = LoggerFactory.getLogger(FranchiseRestController.class);

    private final FranchiseService franchiseService;

    @Autowired
    public FranchiseRestController(FranchiseService franchiseService) {
        this.franchiseService = franchiseService;
    }

    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> submitApplication(@RequestBody FranchiseApplicationDTO application) {
        logger.info("Received new franchise application: {}", application);

        Map<String, Object> response = new HashMap<>();
        
        // Server-side validation
        if (application.getName() == null || application.getName().trim().isEmpty() ||
            application.getEmail() == null || application.getEmail().trim().isEmpty() ||
            application.getPhone() == null || application.getPhone().trim().isEmpty() ||
            application.getCity() == null || application.getCity().trim().isEmpty()) {
            
            response.put("success", false);
            response.put("message", "Validation failed: Required fields are missing.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Persist candidate application via service layer
        try {
            FranchiseApplicationDTO saved = franchiseService.submitApplication(application);
            logger.info("Saved franchise application to database: ID={}", saved.getId());
            
            response.put("success", true);
            response.put("message", "Application submitted and saved successfully.");
            response.put("applicationId", saved.getId());
            response.put("candidateName", saved.getName());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Failed to save franchise application", e);
            response.put("success", false);
            response.put("message", "Internal database error saving application.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

