package org.entry;

import java.util.List;

public interface EntryRepository {
  Integer save(Entry entry);

  List<Entry> findAll();

  String findTitleByEntryId(Integer entryId);

}
