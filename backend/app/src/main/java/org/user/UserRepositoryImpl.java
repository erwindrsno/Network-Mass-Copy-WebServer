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
import at.favre.lib.crypto.bcrypt.BCrypt.Result;

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
    public boolean save(User user) {
        try (Connection conn = super.getConnection()) {
            String checkUsernameExistenceQuery = "SELECT * FROM users WHERE username = ?";
            PreparedStatement checkUsernameExistencePs = conn.prepareStatement(checkUsernameExistenceQuery);
            ResultSet checkUsernameExistenceRs = checkUsernameExistencePs.executeQuery();

            while (checkUsernameExistenceRs.next()) {
                return false;
            }

            String query = "INSERT INTO users(username, password, display_name) VALUES (?,?,?);";
            PreparedStatement ps = conn.prepareStatement(query);

            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getDisplay_name());

            int insertCount = ps.executeUpdate();
            logger.info(insertCount + " rows inserted");
            return true;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public User findById(int id) {
        User user = null;
        try (Connection conn = super.getConnection()) {
            String query = "SELECT * FROM users WHERE id = ?";
            PreparedStatement ps = conn.prepareStatement(query);

            ps.setInt(1, id);
            ResultSet resultSet = ps.executeQuery();

            while (resultSet.next()) {
                Long res_id = resultSet.getLong("id");
                String username = resultSet.getString("username");
                String display_name = resultSet.getString("display_name");
                user = new User(res_id, username, display_name);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return user;
    }

    @Override
    public Long auth(User user) {
        Long user_id = null;
        try (Connection conn = super.getConnection()) {
            String query = "SELECT * FROM users WHERE username = ?";
            PreparedStatement ps = conn.prepareStatement(query);

            ps.setString(1, user.getUsername());

            ResultSet resultSet = ps.executeQuery();
            while (resultSet.next()) {
                String retrievedPassword = resultSet.getString("password");
                Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), retrievedPassword);

                if (result.verified == true) {
                    user_id = resultSet.getLong("id");
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return user_id;
    }
}
