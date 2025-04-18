package org.entry;

import java.util.List;

public interface EntryRepository {
  void save(Entry entry);

  List<Entry> findAll();
}
