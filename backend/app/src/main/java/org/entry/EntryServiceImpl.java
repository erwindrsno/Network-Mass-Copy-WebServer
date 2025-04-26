package org.entry;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
    // Get current time in UTC+7
    ZoneId zoneId = ZoneId.of("UTC+7");
    ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);

    // Convert to java.sql.Timestamp
    Timestamp createdAt = Timestamp.from(zonedDateTime.toInstant());
    // Timestamp createdAt = new Timestamp(System.currentTimeMillis());
    entry.setCreatedAt(createdAt);
    return this.entryRepository.save(entry);
  }

  @Override
  public List<Entry> getAllEntries() {
    return this.entryRepository.findAll();
  }
}
