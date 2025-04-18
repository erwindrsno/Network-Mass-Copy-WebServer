package org.entry;

import java.util.List;

public interface EntryService {
  void createEntry(Entry entry);

  List<Entry> getAllEntries();
}
