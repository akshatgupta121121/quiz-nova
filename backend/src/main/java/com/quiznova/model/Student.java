package com.quiznova.model;

/**
 * Concept: OOP - Inheritance, Polymorphism & Interface Implementation
 * 
 * Student extends User (Inheritance) and implements Gradable (Polymorphism).
 */
public class Student extends User implements Gradable {

    private int totalQuizzesTaken;
    private double cumulativeAverage;
    private double personalBest;
    private int classRank;

    public Student() {
        super();
        setRole(UserRole.STUDENT);
    }

    public Student(String id, String name, String email, String passwordHash) {
        super(id, name, email, passwordHash, UserRole.STUDENT);
    }

    // Polymorphic method implementation from Person
    @Override
    public String getRoleTitle() {
        return "Certified Java Student Candidate";
    }

    // Polymorphic method implementation from Gradable interface
    @Override
    public String calculateGrade(double percentage) {
        if (percentage >= 90.0) return "A+ (Mastery)";
        if (percentage >= 80.0) return "A (Proficient)";
        if (percentage >= 70.0) return "B (Passing)";
        if (percentage >= 60.0) return "C (Needs Review)";
        return "F (Retake Required)";
    }

    public int getTotalQuizzesTaken() {
        return totalQuizzesTaken;
    }

    public void setTotalQuizzesTaken(int totalQuizzesTaken) {
        this.totalQuizzesTaken = totalQuizzesTaken;
    }

    public double getCumulativeAverage() {
        return cumulativeAverage;
    }

    public void setCumulativeAverage(double cumulativeAverage) {
        this.cumulativeAverage = cumulativeAverage;
    }

    public double getPersonalBest() {
        return personalBest;
    }

    public void setPersonalBest(double personalBest) {
        this.personalBest = personalBest;
    }

    public int getClassRank() {
        return classRank;
    }

    public void setClassRank(int classRank) {
        this.classRank = classRank;
    }
}
