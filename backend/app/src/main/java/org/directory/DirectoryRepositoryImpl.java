package org.directory;

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

public class DirectoryRepositoryImpl extends BaseRepository<Directory> implements DirectoryRepository {
  private Logger logger = LoggerFactory.getLogger(DirectoryRepositoryImpl.class);

  @Inject
  public DirectoryRepositoryImpl(DatabaseConfig databaseConfig) {
    super(databaseConfig);
  }

  @Override
  public Integer save(Directory dir) {
    try (Connection conn = super.getConnection()) {
      String query = "INSERT INTO directory(path, copied, owner, file_count) VALUES (?,?,?,?);";
      PreparedStatement ps = conn.prepareStatement(query,
          Statement.RETURN_GENERATED_KEYS);

      ps.setString(1, dir.getPath());
      ps.setInt(2, dir.getCopied());
      ps.setString(3, dir.getOwner());
      ps.setInt(4, dir.getFileCount());

      int insertCount = ps.executeUpdate();
      logger.info(insertCount + "directory rows inserted");
      // Get generated ID
      Integer generatedId = null;
      try (ResultSet rs = ps.getGeneratedKeys()) {
        if (rs.next()) {
          generatedId = rs.getInt(1);
          return generatedId;
        } else {
          throw new Exception("cant get the id");
        }
      }
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

  @Override
  public List<Directory> findByEntryId(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      List<Directory> listResultSet = new ArrayList<>();
      String query = """
              SELECT DISTINCT directory.*
              FROM directory INNER JOIN file
              ON directory.id = file.directory_id
              INNER JOIN entry
              ON entry.id = file.entry_id
              WHERE entry.id = 114
          """;
      PreparedStatement ps = conn.prepareStatement(query);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer id = resultSet.getInt("id");
        Timestamp takeownedAt = resultSet.getTimestamp("takeowned_at");
        String path = resultSet.getString("path");
        int fileCount = resultSet.getInt("file_count");
        int fileCopied = resultSet.getInt("copied");
        Timestamp deletedAt = resultSet.getTimestamp("deleted_at");

        Directory dir = Directory.builder()
            .id(id)
            .takeOwnedAt(takeownedAt)
            .path(path)
            .fileCount(fileCount)
            .copied(fileCopied)
            .deletedAt(deletedAt)
            .build();
        listResultSet.add(dir);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  @Override
  public Integer findCopiedById(Integer directoryId) {
    try (Connection conn = super.getConnection()) {
      String query = "SELECT copied FROM directory WHERE id = ?";

      PreparedStatement ps = conn.prepareStatement(query);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer copiedCount = resultSet.getInt("copied");
        return copiedCount;
      }
      throw new Exception("cant find the copiedCount by this id");
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

  @Override
  public void updateCopiedById(Integer directoryId) {
    try (Connection conn = super.getConnection()) {
      String query = """
              UPDATE directory
              SET copied = (
                  SELECT COUNT(*)
                  FROM file
                  INNER JOIN file_computer ON
                  file.id = file_computer.file_id
                  WHERE file_computer.copied_at IS NOT NULL AND directory_id = ?
              )
              WHERE id = ?;
          """;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, directoryId);
      ps.setInt(2, directoryId);
      ps.executeUpdate();
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }

  @Override
  public void updateTakeownedAtById(Integer directoryId, Timestamp takeownedAt) {
    try (Connection conn = super.getConnection()) {
      String query = """
              UPDATE directory
              SET takeowned_at = ?
              WHERE id = ?;
          """;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setTimestamp(1, takeownedAt);
      ps.setInt(2, directoryId);
      ps.executeUpdate();
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }
}
