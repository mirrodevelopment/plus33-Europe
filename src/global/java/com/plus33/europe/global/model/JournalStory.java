package com.plus33.europe.global.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.io.Serializable;

@Entity
@Table(name = "journal_stories")
public class JournalStory implements Serializable {
    private static final long serialVersionUID = 2L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // Origins, Process, Lifestyle, Design, Rituals

    @Column(nullable = false)
    private String dateString; // "May 12, 2024"

    @Column(nullable = false)
    private String imagePath;

    @Column(length = 500)
    private String excerpt;

    @Column(length = 20)
    private String readTime; // "6 min read"

    @Column(length = 200)
    private String subtitle;

    @Column(nullable = false)
    private boolean featured = false;

    // Constructors
    public JournalStory() {}

    public JournalStory(String title, String category, String dateString, String imagePath) {
        this.title = title;
        this.category = category;
        this.dateString = dateString;
        this.imagePath = imagePath;
    }

    public JournalStory(String title, String category, String dateString, String imagePath,
                         String excerpt, String readTime, String subtitle, boolean featured) {
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

    @Override
    public String toString() {
        return "JournalStory{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", category='" + category + '\'' +
                ", featured=" + featured +
                '}';
    }
}
