package org.file_record_computer;

import java.sql.Timestamp;

public interface FileRecordComputerRepository {
  void save(FileRecordComputer fileRecordComputer);

  void updateCopyTimestampByEntryId(Integer entryId, Timestamp copiedAt);

  void updateCopyStatus(Integer entryId, String ip_addr, Integer fileId, Timestamp copiedAt);
}
