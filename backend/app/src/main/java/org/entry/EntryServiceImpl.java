package org.entry;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.joined_entry_file_filecomputer.CustomDtoOne;

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
    // ambil zona waktu, yaitu UTC+7
    ZoneId zoneId = ZoneId.of("UTC+7");
    // ambil waktu saat pembuatan entri sesuai dengan zona waktu
    ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);

    // konversi waktu ke tipe data time stamp
    Timestamp createdAt = Timestamp.from(zonedDateTime.toInstant());
    entry.setCreatedAt(createdAt);
    return this.entryRepository.save(entry);
  }

  @Override
  public List<Entry> getAllEntries() {
    return this.entryRepository.findAll();
  }

  @Override
  public String getTitleByEntryId(Integer entryId) {
    return this.entryRepository.findTitleByEntryId(entryId);
  }
}
