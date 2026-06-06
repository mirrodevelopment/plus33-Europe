package com.plus33.europe.local.dto;

import java.io.Serializable;

public class ProductDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String origin;
    private String roast;
    private String notes;
    private String imagePath;
    private String badge;

    // Constructors
    public ProductDTO() {}

    public ProductDTO(Long id, String name, String description, Double price, String category, String origin, String roast, String notes, String imagePath, String badge) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.origin = origin;
        this.roast = roast;
        this.notes = notes;
        this.imagePath = imagePath;
        this.badge = badge;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getRoast() { return roast; }
    public void setRoast(String roast) { this.roast = roast; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
}
