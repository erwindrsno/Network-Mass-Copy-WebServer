package org.main;

import java.sql.Connection;
import java.sql.SQLException;

import com.google.inject.Inject;

public abstract class BaseRepository<T> {
    private final DatabaseConfig databaseConfig;

    @Inject
    public BaseRepository(DatabaseConfig databaseConfig) {
        this.databaseConfig = databaseConfig;
    }

    public Connection getConnection() throws SQLException {
        return this.databaseConfig.getConnection();
    }
}
