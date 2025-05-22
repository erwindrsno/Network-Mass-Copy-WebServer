package org.file_record;

import java.io.InputStream;
import java.util.List;

public interface FileRecordService {
  Integer createFileRecord(FileRecord fileRecord);

  List<Integer> bulkCreate(Integer directoryId, List<FileRecord> listFileRecord);

  List<FileRecord> getFileInfo(Integer entryId);

  InputStream downloadFile(Integer entryId, String filename);

  List<String> getOwnerByEntryId(Integer entryId);

  void deleteFileById(Integer entryId);

  void deleteByEntryId(Integer entryId);

  Integer getDirectoryIdById(Integer fileId);
}
