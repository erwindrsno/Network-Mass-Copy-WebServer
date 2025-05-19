package org.file_record;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.main.BaseRepository;
import org.main.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class FileRecordRepositoryImpl extends BaseRepository<FileRecord> implements FileRecordRepository {
  private Logger logger = LoggerFactory.getLogger(FileRecordRepositoryImpl.class);

  @Inject
  public FileRecordRepositoryImpl(DatabaseConfig databaseConfig) {
    super(databaseConfig);
  }

  @Override
  public Integer save(FileRecord fileRecord) {
    try (Connection conn = super.getConnection()) {

      String query = "INSERT INTO file(path, owner, file_name, permissions, size, entry_id, directory_id) VALUES(?, ?, ?, ?, ?, ?, ?)";
      PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

      ps.setString(1, fileRecord.getPath());
      ps.setString(2, fileRecord.getOwner());
      ps.setString(3, fileRecord.getFilename());
      ps.setInt(4, fileRecord.getPermissions());
      ps.setLong(5, fileRecord.getFilesize());
      ps.setInt(6, fileRecord.getEntryId());
      ps.setInt(7, fileRecord.getDirectoryId());

      int insertCount = ps.executeUpdate();

      try (ResultSet rs = ps.getGeneratedKeys()) {
        if (rs.next()) {
          return rs.getInt(1);
        } else {
          return null;
        }
      }
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

  @Override
  public List<FileRecord> findAll() {
    return null;
  }

  @Override
  public List<FileRecord> findByEntryId(Integer entryId) {
    List<FileRecord> listResultSet = new ArrayList<>();
    try (Connection conn = super.getConnection()) {
      String query = "SELECT DISTINCT ON (file_name) id as id, file_name as filename, size as filesize FROM file WHERE entry_id = ?";

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);

      ResultSet rs = ps.executeQuery();

      while (rs.next()) {
        Integer id = rs.getInt("id");
        String filename = rs.getString("filename");
        long filesize = rs.getLong("filesize");
        FileRecord fileRecord = FileRecord.builder()
            .id(id)
            .filename(filename)
            .filesize(filesize)
            .build();
        listResultSet.add(fileRecord);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

  @Override
  public List<String> findOwnerByEntryId(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      List<String> listResultSet = new ArrayList<>();
      String query = "SELECT DISTINCT ON(owner) owner from file WHERE entry_id = ?";
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        listResultSet.add(resultSet.getString("owner"));
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

  @Override
  public void destroyByEntryId(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      String query = "DELETE FROM file WHERE entry_id = ?";
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);

      ps.executeUpdate();
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
  }

  @Override
  public Integer findDirectoryIdById(Integer fileId) {
    try (Connection conn = super.getConnection()) {
      String query = "SELECT directory_id FROM file WHERE id = ?";
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, fileId);

      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        return resultSet.getInt("directory_id");
      }
      throw new Exception("cant get the dir id");
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }
}
