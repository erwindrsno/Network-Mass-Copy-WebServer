package org.entry;

import java.util.List;

public interface EntryService {
  Integer createEntry(Entry entry);

  List<Entry> getAllEntries();
}
