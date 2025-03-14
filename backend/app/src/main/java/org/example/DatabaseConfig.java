package org.example;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.SQLException;

public class DatabaseConfig {
    private static HikariConfig config = new HikariConfig();
    private static HikariDataSource ds;

    static {
        config = new HikariConfig("/hikari.properties");
        ds = new HikariDataSource(config);
    }

    private DatabaseConfig() {
    }

    public static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }
}
