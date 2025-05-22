package org.file_record_computer;

import java.sql.Timestamp;
import java.util.List;

public interface FileRecordComputerRepository {
  void save(FileRecordComputer fileRecordComputer);

  void bulkSave(List<FileRecordComputer> listFileRecordComputer);

  void updateCopiedAtByFileId(String ip_addr, Integer fileId, Timestamp copiedAt);
}
