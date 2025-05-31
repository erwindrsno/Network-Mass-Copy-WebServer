package org.entry;

import java.util.List;

public interface EntryService {
  Integer createEntry(Entry entry);

  List<Entry> getAllEntries();

  List<Entry> getAllDeletedEntries();

  String getTitleById(Integer entryId);

  void softDeleteEntryById(Integer entryId);

  void updateDeleteFilesByDirectoryId(Integer directoryId);

  void updateDeleteFilesByFileId(Integer fileId);

  Boolean getDeleteFilesFlagById(Integer entryId);

}
