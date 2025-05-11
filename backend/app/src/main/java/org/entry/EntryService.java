package org.entry;

import java.util.List;

import org.joined_entry_file_filecomputer.CustomDtoOne;

public interface EntryService {
  Integer createEntry(Entry entry);

  List<Entry> getAllEntries();

  String getTitleByEntryId(Integer entryId);
}
