package org.file_record_computer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;

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
      String query = FileRecordComputerQuery.SAVE;
      PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

      ps.setInt(1, fileRecordComputer.getFileRecordId());
      ps.setInt(2, fileRecordComputer.getComputerId());

      int insertCount = ps.executeUpdate();
      logger.info(insertCount + " rows inserted");
      if (insertCount == 0) {
        throw new RuntimeException("cant insert file compouter");
      }
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      // return null;
    }
  }

  @Override
  public void bulkSave(List<FileRecordComputer> listFileRecordComputer) {
    try (Connection conn = super.getConnection()) {
      String query = FileRecordComputerQuery.BULK_SAVE;
      PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

      for (FileRecordComputer fileRecordComputer : listFileRecordComputer) {
        ps.setInt(1, fileRecordComputer.getFileRecordId());
        ps.setInt(2, fileRecordComputer.getComputerId());
        ps.addBatch();
      }

      ps.executeBatch();
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      // return null;
    }
  }

  @Override
  public void updateCopiedAtByFileId(String ip_addr, Integer fileId, Timestamp copiedAt) {
    try (Connection conn = super.getConnection()) {
      String query = FileRecordComputerQuery.UPDATE_COPIED_AT_BY_FILE_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setTimestamp(1, copiedAt);
      ps.setInt(2, fileId);

      ps.executeUpdate();
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }
}
