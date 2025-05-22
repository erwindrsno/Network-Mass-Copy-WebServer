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
      String query = EntryQuery.SAVE;
      PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

      ps.setString(1, entry.getTitle());
      ps.setBoolean(2, entry.isFromOxam());
      ps.setInt(3, entry.getCount());
      ps.setTimestamp(4, entry.getCreatedAt());
      ps.setBoolean(5, entry.isDeleteFiles());
      ps.setString(6, entry.getBasePath());
      ps.setInt(7, entry.getUserId());

      ps.executeUpdate();

      try (ResultSet rs = ps.getGeneratedKeys()) {
        if (rs.next()) {
          return rs.getInt(1);
        } else {
          return null;
        }
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw new RuntimeException("cant create entry", e);
    }
  }

  @Override
  public List<Entry> findAll() {
    try (Connection conn = super.getConnection()) {
      List<Entry> listResultSet = new ArrayList<>();
      String query = EntryQuery.FIND_ALL;
      PreparedStatement ps = conn.prepareStatement(query);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Entry entry = Entry.builder()
            .id(resultSet.getInt("id"))
            .title(resultSet.getString("title"))
            .isFromOxam(resultSet.getBoolean("is_from_oxam"))
            .createdAt(resultSet.getTimestamp("created_at"))
            .deletedAt(resultSet.getTimestamp("deleted_at"))
            .count(resultSet.getInt("count"))
            .userId(resultSet.getInt("user_id"))
            .deleteFiles(resultSet.getBoolean("delete_files"))
            .build();

        listResultSet.add(entry);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw new RuntimeException("cant find all", e);
    }
  }

  public List<Entry> findAllDeleted() {
    try (Connection conn = super.getConnection()) {
      List<Entry> listResultSet = new ArrayList<>();
      String query = EntryQuery.FIND_ALL_DELETED;
      PreparedStatement ps = conn.prepareStatement(query);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Entry entry = Entry.builder()
            .id(resultSet.getInt("id"))
            .title(resultSet.getString("title"))
            .isFromOxam(resultSet.getBoolean("is_from_oxam"))
            .createdAt(resultSet.getTimestamp("created_at"))
            .deletedAt(resultSet.getTimestamp("deleted_at"))
            .count(resultSet.getInt("count"))
            .userId(resultSet.getInt("user_id"))
            .deleteFiles(resultSet.getBoolean("delete_files"))
            .build();

        listResultSet.add(entry);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw new RuntimeException("cant find all deleted");
    }
  }

  @Override
  public String findTitleById(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      String query = EntryQuery.FIND_TITLE_BY_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        return resultSet.getString("title");
      }
      throw new Exception("cant find title");
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw new RuntimeException("cant get title by entryId", e);
    }
  }

  @Override
  public void updateDeletableById(boolean deletable, Integer entryId) {
    try (Connection conn = super.getConnection()) {
      String query = EntryQuery.UPDATE_DELETABLE_BY_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setBoolean(1, deletable);
      ps.setInt(2, entryId);

      ps.executeUpdate();
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw new RuntimeException("cant update deletable with this entry", e);
    }
  }

  @Override
  public void softDeleteById(Integer entryId, Timestamp deletedAt) {
    try (Connection conn = super.getConnection()) {
      String query = EntryQuery.UPDATE_DELETED_AT_BY_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setTimestamp(1, deletedAt);
      ps.setInt(2, entryId);

      ps.executeUpdate();
    } catch (Exception e) {
      logger.error(e.getMessage());
      throw new RuntimeException("cant soft delete this entry.", e);
    }
  }

  @Override
  public void updateDeleteFilesByDirectoryId(Integer directoryId) {
    try (Connection conn = super.getConnection()) {
      String query = EntryQuery.UPDATE_DELETE_FILES_BY_DIRECTORY_ID;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, directoryId);

      int count = ps.executeUpdate();
      if (count == 0)
        throw new RuntimeException("cant update deleted files on this entry");
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }

  @Override
  public void updateDeleteFilesByFileId(Integer fileId) {
    try (Connection conn = super.getConnection()) {
      String query = EntryQuery.UPDATE_DELETE_FILES_BY_FILE_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, fileId);

      int count = ps.executeUpdate();
      if (count == 0)
        throw new RuntimeException("cant update deleted files on this entry");
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }

  @Override
  public Boolean findDeleteFilesById(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      String query = EntryQuery.FIND_DELETE_FILES_BY_ID;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);
      ResultSet resultSet = ps.executeQuery();
      while (resultSet.next()) {
        return resultSet.getBoolean("delete_files");
      }
      throw new RuntimeException("cant get the delete_files falg");
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      throw new RuntimeException("cant get the delete files flag");
    }
  }
}
