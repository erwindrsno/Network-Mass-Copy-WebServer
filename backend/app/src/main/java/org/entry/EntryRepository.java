package org.entry;

import java.sql.Timestamp;
import java.util.List;

public interface EntryRepository {
  Integer save(Entry entry);

  List<Entry> findAll();

  List<Entry> findAllDeleted();

  String findTitleById(Integer entryId);

  void softDeleteById(Integer entryId, Timestamp deletedAt);

  void updateDeleteFilesByDirectoryId(Integer directoryId);

  void updateDeleteFilesByFileId(Integer fileId);

  Boolean findDeleteFilesById(Integer entryId);
}
