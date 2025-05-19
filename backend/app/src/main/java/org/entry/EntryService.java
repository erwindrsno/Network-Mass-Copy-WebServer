package org.entry;

import java.util.List;

import org.joined_entry_file_filecomputer.CustomDtoOne;

public interface EntryService {
  Integer createEntry(Entry entry);

  List<Entry> getAllEntries();

  String getTitleById(Integer entryId);

  void updateDeletableById(boolean deletable, Integer entryId);

  void softDeleteEntryById(Integer entryId);

  void updateCopyCountById(Integer entryId, int copySuccessCount);

  Integer getCopyCountById(Integer entryId);

  Integer getTakeownCountById(Integer entryId);
}
