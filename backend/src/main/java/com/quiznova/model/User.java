package com.quiznova.model;

/**
 * Concept: OOP - Inheritance & Encapsulation
 * 
 * Concrete entity mapping to the 'users' database table, extending Person.
 */
public class User extends Person {

    private String passwordHash;
    private UserRole role;
    private String avatarUrl;

    public User() {
        super();
    }

    public User(String id, String name, String email, String passwordHash, UserRole role) {
        super(id, name, email);
        this.passwordHash = passwordHash;
        this.role = role;
    }

    @Override
    public String getRoleTitle() {
        return this.role != null ? this.role.name() : "GUEST";
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
