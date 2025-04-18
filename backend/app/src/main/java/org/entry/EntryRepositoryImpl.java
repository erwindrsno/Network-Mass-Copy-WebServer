package org.entry;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.computer.Computer;
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
  public void save(Entry entry) {
    try (Connection conn = super.getConnection()) {

      String query = "INSERT INTO entry(title, completeness, user_id) VALUES(?, ?, ?)";
      PreparedStatement ps = conn.prepareStatement(query);

      ps.setString(1, entry.getTitle());
      ps.setString(2, entry.getCompleteness());
      ps.setInt(3, entry.getUserId());

      int insertCount = ps.executeUpdate();
      logger.info(insertCount + " rows inserted");
    } catch (Exception e) {
      logger.error(e.getMessage());
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
        String completeness = resultSet.getString("completeness");
        Integer userId = resultSet.getInt("user_id");
        Entry entry = new Entry(id, title, completeness, userId);
        listResultSet.add(entry);
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return listResultSet;
  }
}
