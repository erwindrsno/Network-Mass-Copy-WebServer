package org.entry;

import java.util.List;

import org.custom_dto.JoinedEntry;

public interface EntryRepository {
  Integer save(Entry entry);

  List<Entry> findAll();

  List<Entry> findAllWithJoined();
}
