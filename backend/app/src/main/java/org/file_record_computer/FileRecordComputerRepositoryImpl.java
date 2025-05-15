package org.file_record_computer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;

import org.file_record.FileRecordRepositoryImpl;
import org.main.BaseRepository;
import org.main.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class FileRecordComputerRepositoryImpl extends BaseRepository<FileRecordComputer>
    implements FileRecordComputerRepository {

  private Logger logger = LoggerFactory.getLogger(FileRecordRepositoryImpl.class);

  @Inject
  public FileRecordComputerRepositoryImpl(DatabaseConfig databaseConfig) {
    super(databaseConfig);
  }

  @Override
  public void save(FileRecordComputer fileRecordComputer) {
    try (Connection conn = super.getConnection()) {

      String query = "INSERT INTO file_computer(file_id, computer_id) VALUES(?, ?)";
      PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

      ps.setInt(1, fileRecordComputer.getFileRecordId());
      ps.setInt(2, fileRecordComputer.getComputerId());

      int insertCount = ps.executeUpdate();
      logger.info(insertCount + " rows inserted");

    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      // return null;
    }
  }

  @Override
  public void updateCopyTimestampByEntryId(Integer entryId, Timestamp copiedAt) {
    try (Connection conn = super.getConnection()) {
      String updateClause = "UPDATE file_computer";
      String setClause = "SET copied_at = ?";
      String fromClause = "FROM file";
      String whereClause = "WHERE file.entry_id = ?";
      String secondWhereClause = "AND file.id = file_computer.file_id";

      String query = updateClause + " " + setClause + " " + fromClause + " " + whereClause + " " + secondWhereClause;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setTimestamp(1, copiedAt);
      ps.setInt(2, entryId);
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }

  @Override
  public void updateCopyStatus(Integer entryId, String ip_addr, Integer fileId, Timestamp copiedAt) {
    try (Connection conn = super.getConnection()) {
      String updateClause = "UPDATE file_computer";
      String setClause = "SET copied_at = ?";
      String fromClause = "FROM file";
      String firstWhereClause = "WHERE file.id = file_computer.file_id";
      String secondWhereClause = "AND file.entry_id = ?";
      String thirdWhereClause = "AND file.id = ?";

      String query = updateClause + " " + setClause + " " + fromClause + " " + firstWhereClause + " "
          + secondWhereClause + " " + thirdWhereClause;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setTimestamp(1, copiedAt);
      ps.setInt(2, entryId);
      ps.setInt(3, fileId);

      ps.executeUpdate();
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }
}
