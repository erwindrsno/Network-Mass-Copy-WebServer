package org.entry;

import static io.javalin.apibuilder.ApiBuilder.delete;

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
  public String getTitleById(Integer entryId) {
    return this.entryRepository.findTitleByEntryId(entryId);
  }

  @Override
  public void updateDeletableById(boolean deletable, Integer entryId) {
    this.entryRepository.updateDeletable(deletable, entryId);
  }

  @Override
  public void softDeleteEntryById(Integer entryId) {
    // ambil zona waktu, yaitu UTC+7
    ZoneId zoneId = ZoneId.of("UTC+7");
    // ambil waktu saat pembuatan entri sesuai dengan zona waktu
    ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);

    // konversi waktu ke tipe data time stamp
    Timestamp deletedAt = Timestamp.from(zonedDateTime.toInstant());
    this.entryRepository.softDeleteById(entryId, deletedAt);
  }

  @Override
  public void updateCopyCountById(Integer entryId, int copySuccessCount) {
    this.entryRepository.updateCopyCountById(entryId, copySuccessCount);
  }

  @Override
  public Integer getCopyCountById(Integer entryId) {
    return this.entryRepository.findCopyCountById(entryId);
  }

  @Override
  public Integer getTakeownCountById(Integer entryId) {
    return this.entryRepository.findTakeownCountById(entryId);
  }
}
