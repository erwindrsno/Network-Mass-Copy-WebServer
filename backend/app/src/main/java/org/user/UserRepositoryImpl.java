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
    try (Connection conn = super.getConnection()) {
      List<User> listResultSet = new ArrayList<>();
      String query = UserQuery.FIND_ALL;
      PreparedStatement ps = conn.prepareStatement(query);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        User user = User.builder()
            .id(resultSet.getInt("id"))
            .username(resultSet.getString("username"))
            .display_name(resultSet.getString("display_name"))
            .role(resultSet.getString("role"))
            .build();
        listResultSet.add(user);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw new RuntimeException("cant find all");
    }
  }

  @Override
  public boolean save(User user) {
    try (Connection conn = super.getConnection()) {
      String query = UserQuery.SAVE;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setString(1, user.getUsername());
      ps.setString(2, user.getPassword());
      ps.setString(3, user.getDisplay_name());
      ps.setString(4, user.getRole());

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
      String query = UserQuery.FIND_BY_ID;
      PreparedStatement ps = conn.prepareStatement(query);

      ps.setInt(1, id);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        User user = User.builder()
            .id(id)
            .username(resultSet.getString("username"))
            .display_name(resultSet.getString("display_name"))
            .build();
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
      String query = UserQuery.FIND_BY_USERNAME;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setString(1, username);

      ResultSet resultSet = ps.executeQuery();
      while (resultSet.next()) {
        User retrievedUser = User.builder()
            .id(resultSet.getInt("id"))
            .username(resultSet.getString("username"))
            .password(resultSet.getString("password"))
            .display_name(resultSet.getString("display_name"))
            .role(resultSet.getString("role"))
            .build();

        return retrievedUser;
      }
      return null;
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw new RuntimeException("cant find user by username");
    }
  }

  @Override
  public boolean destroyById(Integer id) {
    try (Connection conn = super.getConnection()) {
      String query = UserQuery.DESTROY_BY_ID;
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

  @Override
  public String findHashedPasswordById(Integer id) {
    try (Connection conn = super.getConnection()) {
      String query = UserQuery.FIND_PASSWORD_BY_ID;
      PreparedStatement ps = conn.prepareStatement(query);

      ps.setInt(1, id);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        return resultSet.getString("password");
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return null;
  }
}
