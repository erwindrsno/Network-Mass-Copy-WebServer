package org.joined_entry_file_filecomputer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.computer.Computer;
import org.entry.EntryRepositoryImpl;
import org.file_record.FileRecord;
import org.file_record_computer.FileRecordComputer;
import org.main.BaseRepository;
import org.main.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class CustomDtoOneRepositoryImpl extends BaseRepository<CustomDtoOne> implements CustomDtoOneRepository {
  private Logger logger = LoggerFactory.getLogger(EntryRepositoryImpl.class);

  @Inject
  public CustomDtoOneRepositoryImpl(DatabaseConfig databaseConfig) {
    super(databaseConfig);
  }

  @Override
  public List<CustomDtoOne> findJoinedByEntryIdAndFilename(Integer entryId, String filename) {
    try (Connection conn = super.getConnection()) {
      List<CustomDtoOne> listResultSet = new ArrayList<>();
      String select = "SELECT file.id as fileId, file_computer.id as fileComputerId, file.path, file.owner, file.permissions, file_computer.copied_at, file_computer.takeowned_at, computer.id as computerId, computer.host_name, computer.ip_address, computer.lab_num";
      String joinEntryFileRecord = "FROM file INNER JOIN entry ON file.entry_id = entry.id";
      String joinFileComputer = "INNER JOIN file_computer ON file.id = file_computer.file_id";
      String joinComputer = "INNER JOIN computer ON file_computer.computer_id = computer.id";
      String whereClause = "WHERE entry.id = ?";

      String query = select + " " + joinEntryFileRecord + " " + joinFileComputer + " " + joinComputer + " "
          + whereClause;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer fileRecordId = resultSet.getInt("fileId");
        String filePath = resultSet.getString("path");
        String owner = resultSet.getString("owner");
        Integer permissions = resultSet.getInt("permissions");

        Integer fileRecordComputerId = resultSet.getInt("fileComputerId");
        Timestamp copiedAt = resultSet.getTimestamp("copied_at");
        Timestamp takeownedAt = resultSet.getTimestamp("takeowned_at");

        Integer computerId = resultSet.getInt("computerId");
        String hostname = resultSet.getString("host_name");
        Integer lab_num = resultSet.getInt("lab_num");
        String ip_address = resultSet.getString("ip_address");

        FileRecord tempFileRecord = new FileRecord(fileRecordId, filePath, owner, permissions);
        FileRecordComputer tempFileRecordComputer = new FileRecordComputer(fileRecordComputerId, copiedAt,
            takeownedAt);
        Computer tempComputer = new Computer(computerId, ip_address, hostname, lab_num);
        CustomDtoOne customDtoOne = new CustomDtoOne(tempFileRecord, tempFileRecordComputer, tempComputer);
        listResultSet.add(customDtoOne);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }
}
