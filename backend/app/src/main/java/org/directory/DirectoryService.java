package org.directory;

public interface DirectoryService {
  Integer insertDirectory(Directory dir);

  Integer getFileCopiedCountById(Integer directoryId);

  void updateFileCopiedCountById(Integer directoryId);

  void updateTakeownedAtById(Integer directoryId);
}
