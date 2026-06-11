package com.plus33.europe.global.dto;

import java.io.Serializable;

public class JournalStoryDTO implements Serializable {
    private static final long serialVersionUID = 2L;

    private Long id;
    private String title;
    private String category;
    private String dateString;
    private String imagePath;
    private String excerpt;
    private String readTime;
    private String subtitle;
    private boolean featured;

    // Constructors
    public JournalStoryDTO() {}

    public JournalStoryDTO(Long id, String title, String category, String dateString, String imagePath) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.dateString = dateString;
        this.imagePath = imagePath;
    }

    public JournalStoryDTO(Long id, String title, String category, String dateString, String imagePath,
                            String excerpt, String readTime, String subtitle, boolean featured) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.dateString = dateString;
        this.imagePath = imagePath;
        this.excerpt = excerpt;
        this.readTime = readTime;
        this.subtitle = subtitle;
        this.featured = featured;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDateString() { return dateString; }
    public void setDateString(String dateString) { this.dateString = dateString; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getReadTime() { return readTime; }
    public void setReadTime(String readTime) { this.readTime = readTime; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
