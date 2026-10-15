package com.quiznova.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Concept: JDBC - Database Connection Management & Connection Pooling
 * 
 * Thread-safe singleton providing pooled database connections using HikariCP.
 * Demonstrates: Static initialization, Properties loading, Exception handling,
 * and Connection Pooling.
 */
public class DBConnection {

    private static HikariDataSource dataSource;
    private static Properties properties = new Properties();

    static {
        try {
            // Load db.properties from classpath
            try (InputStream input = DBConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
                if (input != null) {
                    properties.load(input);
                } else {
                    // Fallback defaults
                    properties.setProperty("db.driver", "com.mysql.cj.jdbc.Driver");
                    properties.setProperty("db.url", "jdbc:mysql://localhost:3306/quiznova_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
                    properties.setProperty("db.username", "root");
                    properties.setProperty("db.password", "root123");
                }
            }

            // Register JDBC driver explicitly
            Class.forName(properties.getProperty("db.driver", "com.mysql.cj.jdbc.Driver"));

            // Initialize HikariCP Pool
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(properties.getProperty("db.url"));
            config.setUsername(properties.getProperty("db.username"));
            config.setPassword(properties.getProperty("db.password"));
            config.setMaximumPoolSize(Integer.parseInt(properties.getProperty("pool.maximumPoolSize", "10")));
            config.setMinimumIdle(Integer.parseInt(properties.getProperty("pool.minimumIdle", "2")));
            config.setIdleTimeout(Long.parseLong(properties.getProperty("pool.idleTimeout", "30000")));
            config.setConnectionTimeout(Long.parseLong(properties.getProperty("pool.connectionTimeout", "20000")));

            // Optimization properties
            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

            dataSource = new HikariDataSource(config);
        } catch (Exception e) {
            System.err.println("[DBConnection] HikariCP initialization warning: " + e.getMessage() + ". Direct connection fallback ready.");
        }
    }

    /**
     * Obtains an active connection from the pool. Caller MUST close it in a try-with-resources block!
     *
     * @return java.sql.Connection
     * @throws SQLException on database connectivity failure
     */
    public static Connection getConnection() throws SQLException {
        if (dataSource != null && !dataSource.isClosed()) {
            return dataSource.getConnection();
        }
        // Fallback direct connection
        return DriverManager.getConnection(
                properties.getProperty("db.url"),
                properties.getProperty("db.username"),
                properties.getProperty("db.password")
        );
    }

    /**
     * Gracefully shuts down connection pool on application undeployment.
     */
    public static void shutdown() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
