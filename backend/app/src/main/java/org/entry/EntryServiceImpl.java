package org.entry;

import java.util.List;

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
  public void createEntry(Entry entry) {
    this.entryRepository.save(entry);
  }

  @Override
  public List<Entry> getAllEntries() {
    return this.entryRepository.findAll();
  }
}
