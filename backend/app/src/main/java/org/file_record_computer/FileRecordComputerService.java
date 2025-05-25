package org.file_record_computer;

import java.util.List;

public interface FileRecordComputerService {
  void createFileRecordComputer(FileRecordComputer fileRecordComputer);

  void updateCopiedAt(String ip_addr, Integer fileId);

  void bulkCreate(List<FileRecordComputer> listFileRecordComputer);

  void updateDeletedAtById(Integer fileId);
}
