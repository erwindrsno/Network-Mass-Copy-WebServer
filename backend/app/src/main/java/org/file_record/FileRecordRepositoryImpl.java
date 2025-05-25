package org.file_record;

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
public class FileRecordRepositoryImpl extends BaseRepository<FileRecord> implements FileRecordRepository {
  private Logger logger = LoggerFactory.getLogger(FileRecordRepositoryImpl.class);

  @Inject
  public FileRecordRepositoryImpl(DatabaseConfig databaseConfig) {
    super(databaseConfig);
  }

  @Override
  public Integer save(FileRecord fileRecord) {
    try (Connection conn = super.getConnection()) {

      String query = FileRecordQuery.SAVE;
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
          throw new RuntimeException("cant insert");
        }
      }
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      throw new RuntimeException("cant insert");
    }
  }

  public List<Integer> bulkSave(Integer directoryId, List<FileRecord> listFileRecord) {
    try (Connection conn = super.getConnection()) {
      String query = FileRecordQuery.SAVE;
      PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

      for (FileRecord fileRecord : listFileRecord) {
        ps.setString(1, fileRecord.getPath());
        ps.setString(2, fileRecord.getOwner());
        ps.setString(3, fileRecord.getFilename());
        ps.setInt(4, fileRecord.getPermissions());
        ps.setLong(5, fileRecord.getFilesize());
        ps.setInt(6, fileRecord.getEntryId());
        ps.setInt(7, directoryId);
        ps.addBatch();
      }

      ps.executeBatch();

      ResultSet rs = ps.getGeneratedKeys();
      List<Integer> generatedIds = new ArrayList<>();
      while (rs.next()) {
        generatedIds.add(rs.getInt(1));
        logger.info("the id after insert batch is: " + rs.getInt(1));
      }
      return generatedIds;
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      throw new RuntimeException("cant bulk save");
    }
  }

  @Override
  public List<FileRecord> findAll() {
    return null;
  }

  @Override
  public List<FileRecord> findByEntryId(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      List<FileRecord> listResultSet = new ArrayList<>();
      String query = FileRecordQuery.FIND_BY_ENTRY_ID;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);

      ResultSet rs = ps.executeQuery();

      while (rs.next()) {
        FileRecord fileRecord = FileRecord.builder()
            .id(rs.getInt("id"))
            .filename(rs.getString("filename"))
            .filesize(rs.getLong("filesize"))
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
      String query = FileRecordQuery.FIND_OWNER_BY_ENTRY_ID;
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
      String query = FileRecordQuery.FIND_DIRECTORY_ID_BY_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, fileId);

      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        return resultSet.getInt("directory_id");
      }
      throw new RuntimeException("cant get the dir id");
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      throw new RuntimeException("cant get the dir id");
    }
  }

}
