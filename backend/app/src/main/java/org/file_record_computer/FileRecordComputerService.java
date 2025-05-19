package org.file_record_computer;

public interface FileRecordComputerService {
  void createFileRecordComputer(FileRecordComputer fileRecordComputer);

  void setCopyTimestamp(Integer entryId);

  void updateCopiedAt(String ip_addr, Integer fileId);

  void deleteByEntryId(Integer entryId);
}
