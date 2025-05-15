package org.entry;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.main.BaseRepository;
import org.main.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class EntryRepositoryImpl extends BaseRepository<Entry> implements EntryRepository {
  private Logger logger = LoggerFactory.getLogger(EntryRepositoryImpl.class);

  @Inject
  public EntryRepositoryImpl(DatabaseConfig databaseConfig) {
    super(databaseConfig);
  }

  @Override
  public Integer save(Entry entry) {
    try (Connection conn = super.getConnection()) {

      String query = "INSERT INTO entry(title, copy_status, takeown_status, is_from_oxam, count, created_at, user_id) VALUES(?, ?, ?, ?, ?, ?, ?)";
      PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

      ps.setString(1, entry.getTitle());
      ps.setString(2, entry.getCopyStatus());
      ps.setString(3, entry.getTakeownStatus());
      ps.setBoolean(4, entry.isFromOxam());
      ps.setInt(5, entry.getCount());
      ps.setTimestamp(6, entry.getCreatedAt());
      ps.setInt(7, entry.getUserId());

      int insertCount = ps.executeUpdate();
      logger.info(insertCount + " rows inserted");

      try (ResultSet rs = ps.getGeneratedKeys()) {
        if (rs.next()) {
          return rs.getInt(1);
        } else {
          return null;
        }
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  @Override
  public List<Entry> findAll() {
    List<Entry> listResultSet = new ArrayList<>();
    try (Connection conn = super.getConnection()) {

      String query = "SELECT * FROM entry";
      PreparedStatement ps = conn.prepareStatement(query);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer id = resultSet.getInt("id");
        String title = resultSet.getString("title");
        String copyStatus = resultSet.getString("copy_status");
        String takeownStatus = resultSet.getString("takeown_status");
        boolean isFromOxam = resultSet.getBoolean("is_from_oxam");
        Timestamp createdAt = resultSet.getTimestamp("created_at");
        int count = resultSet.getInt("count");
        Integer userId = resultSet.getInt("user_id");

        Entry entry = Entry.builder()
            .id(id)
            .title(title)
            .copyStatus(copyStatus)
            .takeownStatus(takeownStatus)
            .isFromOxam(isFromOxam)
            .createdAt(createdAt)
            .count(count)
            .userId(userId)
            .build();

        listResultSet.add(entry);
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return listResultSet;
  }

  @Override
  public String findTitleByEntryId(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      String title = "";
      String query = "SELECT title FROM entry WHERE id = ?";
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        title = resultSet.getString("title");
      }
      return title;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }
}
