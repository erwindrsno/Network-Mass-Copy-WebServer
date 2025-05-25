package org.file_record;

import java.sql.Timestamp;
import java.util.List;

public interface FileRecordRepository {
  Integer save(FileRecord fileRecord);

  List<Integer> bulkSave(Integer directoryId, List<FileRecord> listFileRecord);

  List<FileRecord> findAll();

  List<FileRecord> findByEntryId(Integer entryId);

  List<String> findOwnerByEntryId(Integer entryId);

  void destroyByEntryId(Integer entryId);

  Integer findDirectoryIdById(Integer fileId);

}
