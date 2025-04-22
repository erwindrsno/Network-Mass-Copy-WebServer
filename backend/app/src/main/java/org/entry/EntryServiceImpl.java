package org.entry;

import java.util.List;

import org.custom_dto.JoinedEntry;

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
    return this.entryRepository.save(entry);
  }

  @Override
  public List<Entry> getAllEntries() {
    return this.entryRepository.findAll();
  }

  @Override
  public List<Entry> getAllJoinedEntries() {
    return this.entryRepository.findAllWithJoined();
  }
}
