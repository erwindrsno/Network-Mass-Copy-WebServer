package org.file_record_computer;

public interface FileRecordComputerService {
  void createFileRecordComputer(FileRecordComputer fileRecordComputer);

  void setCopyTimestamp(Integer entryId);

  void updateCopyStatus(Integer entryId, String ip_addr, Integer fileId);
}
