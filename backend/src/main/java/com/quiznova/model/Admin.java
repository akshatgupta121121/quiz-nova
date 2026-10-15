package com.quiznova.model;

/**
 * Concept: OOP - Inheritance & Specialization
 * 
 * Admin extends User with instructor administrative privileges.
 */
public class Admin extends User {

    private String department;
    private boolean canManageQuizzes;
    private boolean canExportAuditLogs;

    public Admin() {
        super();
        setRole(UserRole.ADMIN);
        this.canManageQuizzes = true;
        this.canExportAuditLogs = true;
    }

    public Admin(String id, String name, String email, String passwordHash, String department) {
        super(id, name, email, passwordHash, UserRole.ADMIN);
        this.department = department;
        this.canManageQuizzes = true;
        this.canExportAuditLogs = true;
    }

    @Override
    public String getRoleTitle() {
        return "Instructor / Curriculum Administrator";
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public boolean isCanManageQuizzes() {
        return canManageQuizzes;
    }

    public void setCanManageQuizzes(boolean canManageQuizzes) {
        this.canManageQuizzes = canManageQuizzes;
    }

    public boolean isCanExportAuditLogs() {
        return canExportAuditLogs;
    }

    public void setCanExportAuditLogs(boolean canExportAuditLogs) {
        this.canExportAuditLogs = canExportAuditLogs;
    }
}
