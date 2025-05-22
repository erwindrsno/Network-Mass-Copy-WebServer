package org.entry;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;
import org.util.TimeUtil;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class EntryServiceImpl implements EntryService {
  private final EntryRepository entryRepository;

  @Inject
  public EntryServiceImpl(EntryRepository entryRepository) {
    this.entryRepository = entryRepository;
  }

  @Override
  public Integer createEntry(Entry entry) {
    Timestamp createdAt = TimeUtil.nowTimestamp();
    entry.setCreatedAt(createdAt);
    return this.entryRepository.save(entry);
  }

  @Override
  public List<Entry> getAllEntries() {
    return this.entryRepository.findAll();
  }

  @Override
  public List<Entry> getAllDeletedEntries() {
    return this.entryRepository.findAllDeleted();
  }

  @Override
  public String getTitleById(Integer entryId) {
    return this.entryRepository.findTitleById(entryId);
  }

  @Override
  public void updateDeletableById(boolean deletable, Integer entryId) {
    this.entryRepository.updateDeletableById(deletable, entryId);
  }

  @Override
  public void softDeleteEntryById(Integer entryId) {
    Timestamp deletedAt = TimeUtil.nowTimestamp();
    this.entryRepository.softDeleteById(entryId, deletedAt);
  }

  @Override
  public void updateDeleteFilesByDirectoryId(Integer directoryId) {
    this.entryRepository.updateDeleteFilesByDirectoryId(directoryId);
  }

  @Override
  public void updateDeleteFilesByFileId(Integer fileId) {
    this.entryRepository.updateDeleteFilesByFileId(fileId);
  }

  @Override
  public Boolean getDeleteFilesFlagById(Integer entryId) {
    return this.entryRepository.findDeleteFilesById(entryId);
  }
}
