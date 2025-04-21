package org.file_record;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
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

      String query = "INSERT INTO file_record(path, owner, permissions, copied_at, takeowned_at, entry_id) VALUES(?, ?, ?, ?::timestamp, ?::timestamp, ?)";
      PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

      ps.setString(1, fileRecord.getPath());
      ps.setString(2, fileRecord.getOwner());
      ps.setInt(3, fileRecord.getPermissions());
      ps.setString(4, null);
      ps.setString(5, null);
      ps.setInt(6, fileRecord.getEntryId());

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
  public List<FileRecord> findAll() {
    return null;
  }
}
