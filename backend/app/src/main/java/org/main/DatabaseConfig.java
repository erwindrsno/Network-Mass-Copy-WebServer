package org.main;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.SQLException;

@Singleton
public class DatabaseConfig {
    private final HikariDataSource hikariDataSource;

    @Inject
    public DatabaseConfig() {
        HikariConfig config = new HikariConfig("/hikari.properties");
        this.hikariDataSource = new HikariDataSource(config);
    }

    public Connection getConnection() throws SQLException {
        return this.hikariDataSource.getConnection();
    }
}
