package org.entry;

import java.util.List;
import org.custom_dto.JoinedEntry;

public interface EntryService {
  Integer createEntry(Entry entry);

  List<Entry> getAllEntries();

  List<Entry> getAllJoinedEntries();
}
