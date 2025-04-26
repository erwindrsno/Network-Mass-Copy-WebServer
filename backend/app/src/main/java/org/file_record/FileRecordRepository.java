package org.file_record;

import java.util.List;

public interface FileRecordRepository {
  Integer save(FileRecord fileRecord);

  List<FileRecord> findAll();

  List<FileRecord> findByEntryId(Integer entryId);
}
