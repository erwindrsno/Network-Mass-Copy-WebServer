package org.file_record_computer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

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
      logger.error(e.getMessage());
      // return null;
    }
  }
}
