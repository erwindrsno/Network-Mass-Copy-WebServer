package org.directory;

public interface DirectoryService {
  Integer createDirectory(Directory dir);

  Integer getFileCopiedCountById(Integer directoryId);

  void updateFileCopiedCountById(Integer directoryId);

  void updateTakeownedAtById(Integer directoryId);

  void updateDeletedAtById(Integer directoryId);

  void createDirectoryByEntryId(Integer entryId, Integer labNum, Integer hostNum, String owner);
}
