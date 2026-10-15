package com.quiznova.model;

import java.sql.Timestamp;

/**
 * Concept: OOP - Abstraction & Encapsulation
 * 
 * Base abstract class defining standard personal identity attributes.
 * Cannot be directly instantiated. Subclasses must inherit and supply
 * concrete role semantics.
 */
public abstract class Person {

    // Encapsulation: private attributes with controlled access via getters/setters
    private String id;
    private String name;
    private String email;
    private Timestamp createdAt;

    // Constructors demonstrating constructor overloading
    public Person() {
    }

    public Person(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }

    // Abstract method: forces subclasses to provide polymorphic role title
    public abstract String getRoleTitle();

    // Getters and Setters demonstrating Encapsulation
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Person name cannot be null or blank");
        }
        this.name = name.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        this.email = email.trim().toLowerCase();
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Person{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
