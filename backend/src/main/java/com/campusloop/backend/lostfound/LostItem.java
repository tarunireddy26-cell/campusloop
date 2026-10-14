package com.campusloop.backend.lostfound;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class LostItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String description;
    private String locationFound;
    private String dateFound;
    private String imageUrl;
    private String contact;

    public LostItem() {
    }

    public LostItem(String itemName, String description,
                    String locationFound, String dateFound,
                    String imageUrl, String contact) {

        this.itemName = itemName;
        this.description = description;
        this.locationFound = locationFound;
        this.dateFound = dateFound;
        this.imageUrl = imageUrl;
        this.contact = contact;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocationFound() {
        return locationFound;
    }

    public void setLocationFound(String locationFound) {
        this.locationFound = locationFound;
    }

    public String getDateFound() {
        return dateFound;
    }

    public void setDateFound(String dateFound) {
        this.dateFound = dateFound;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }
}