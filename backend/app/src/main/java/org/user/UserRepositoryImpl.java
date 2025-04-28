package org.user;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.main.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.main.BaseRepository;

@Singleton
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

      String query = "SELECT * FROM users";
      PreparedStatement ps = conn.prepareStatement(query);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer id = resultSet.getInt("id");
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
  public User findById(Integer id) {
    try (Connection conn = super.getConnection()) {
      String query = "SELECT * FROM users WHERE id = ?";
      PreparedStatement ps = conn.prepareStatement(query);

      ps.setInt(1, id);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer res_id = resultSet.getInt("id");
        String username = resultSet.getString("username");
        String display_name = resultSet.getString("display_name");
        User user = new User(res_id, username, display_name);
        return user;
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return null;
  }

  @Override
  public User findUserByUsername(String username) {
    try (Connection conn = super.getConnection()) {
      String query = "SELECT * FROM users WHERE username = ?";
      PreparedStatement ps = conn.prepareStatement(query);

      ps.setString(1, username);

      ResultSet resultSet = ps.executeQuery();
      while (resultSet.next()) {
        Integer retrievedId = resultSet.getInt("id");
        String retrievedUsername = resultSet.getString("username");
        String retrievedPassword = resultSet.getString("password");
        String retrievedDisplayName = resultSet.getString("display_name");

        User retrievedUser = new User(retrievedId, retrievedUsername, retrievedPassword, retrievedDisplayName);
        return retrievedUser;
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return null;
  }

  @Override
  public boolean destroyById(Integer id) {
    try (Connection conn = super.getConnection()) {
      String query = "DELETE FROM users WHERE id = ?";

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, id);

      int affectedRows = ps.executeUpdate();
      if (affectedRows == 1) {
        return true;
      }
      return false;
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return false;
  }
}
