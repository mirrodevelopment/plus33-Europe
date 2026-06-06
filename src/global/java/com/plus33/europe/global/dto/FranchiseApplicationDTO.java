package com.plus33.europe.global.dto;

import java.io.Serializable;

public class FranchiseApplicationDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String city;
    private String capital;
    private String background;

    // Constructors
    public FranchiseApplicationDTO() {}

    public FranchiseApplicationDTO(Long id, String name, String email, String phone, String city, String capital, String background) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.city = city;
        this.capital = capital;
        this.background = background;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCapital() { return capital; }
    public void setCapital(String capital) { this.capital = capital; }

    public String getBackground() { return background; }
    public void setBackground(String background) { this.background = background; }
}
