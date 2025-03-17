package org.main;

import java.sql.Connection;
import java.sql.PreparedStatement;
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

    // private void openConnectionToDatabase() {
    // try {
    // this.conn = DatabaseConfig.getConnection();
    // } catch (Exception e) {
    // this.logger.error("Something went wrong when get Connection");
    // }
    // }

    // private void closeConnectionToDatabase() {
    // try {
    // this.conn.close();
    // } catch (Exception e) {
    // this.logger.error("Something went wrong when close Connection");
    // }
    // }
}
