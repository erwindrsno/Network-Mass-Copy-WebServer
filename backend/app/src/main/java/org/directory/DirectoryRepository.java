package org.directory;

import java.sql.Timestamp;
import java.util.List;

public interface DirectoryRepository {
  Integer save(Directory dir);

  List<Directory> findByEntryId(Integer entryId);

  Integer findCopiedById(Integer directoryId);

  void updateCopiedById(Integer directoryId);

  void updateTakeownedAtById(Integer directoryId, Timestamp takeownedAt);
}
