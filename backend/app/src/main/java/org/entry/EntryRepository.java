package org.entry;

import java.sql.Timestamp;
import java.util.List;

public interface EntryRepository {
  Integer save(Entry entry);

  List<Entry> findAll();

  String findTitleByEntryId(Integer entryId);

  void updateDeletable(boolean deletable, Integer entryId);

  void softDeleteById(Integer entryId, Timestamp deletedAt);

  void updateCopyCountById(Integer entryId, int copySuccessCount);

  Integer findCopyCountById(Integer entryId);

  Integer findTakeownCountById(Integer entryId);
}
