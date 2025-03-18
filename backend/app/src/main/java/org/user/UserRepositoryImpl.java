package org.user;

import com.google.inject.Inject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.main.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.main.BaseRepository;

import at.favre.lib.crypto.bcrypt.*;

public class UserRepositoryImpl extends BaseRepository<User> implements UserRepository {
    private Logger logger = LoggerFactory.getLogger(UserRepositoryImpl.class);

    @Inject
    public UserRepositoryImpl(DatabaseConfig databaseConfig) {
        super(databaseConfig);
    }

    @Override
    public List<User> findAll() {
        List<User> listResultSet = new ArrayList<>();

        try (Connection conn = super.getConnection()) {

            String query = "SELECT * FROM user";
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet resultSet = ps.executeQuery();

            while (resultSet.next()) {
                Long id = resultSet.getLong("id");
                String username = resultSet.getString("username");
                String display_name = resultSet.getString("display_name");
                User user = new User(id, username, display_name);
                listResultSet.add(user);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return listResultSet;
    }

    @Override
    public void save(User user) {
        try (Connection conn = super.getConnection()) {

            String query = "INSERT INTO users(username, password, display_name) VALUES (?,?,?);";
            PreparedStatement ps = conn.prepareStatement(query);

            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getDisplay_name());

            int insertCount = ps.executeUpdate();
            logger.info(insertCount + " rows inserted");
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }
}
