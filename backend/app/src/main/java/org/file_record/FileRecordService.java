package org.file_record;

import java.util.List;

public interface FileRecordService {
  Integer createFileRecord(FileRecord fileRecord);

  List<FileRecord> getFileInfo(Integer entryId);
}
