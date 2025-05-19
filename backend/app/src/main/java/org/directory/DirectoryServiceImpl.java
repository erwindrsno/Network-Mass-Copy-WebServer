package org.directory;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class DirectoryServiceImpl implements DirectoryService {
  private final DirectoryRepository directoryRepository;

  @Inject
  public DirectoryServiceImpl(DirectoryRepository directoryRepository) {
    this.directoryRepository = directoryRepository;
  }

  @Override
  public Integer insertDirectory(Directory dir) {
    return this.directoryRepository.save(dir);
  }

  @Override
  public Integer getFileCopiedCountById(Integer directoryId) {
    return this.directoryRepository.findCopiedById(directoryId);
  }

  @Override
  public void updateFileCopiedCountById(Integer directoryId) {
    this.directoryRepository.updateCopiedById(directoryId);
  }

  @Override
  public void updateTakeownedAtById(Integer directoryId) {
    // ambil zona waktu, yaitu UTC+7
    ZoneId zoneId = ZoneId.of("UTC+7");
    // ambil waktu saat pembuatan entri sesuai dengan zona waktu
    ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);

    // konversi waktu ke tipe data time stamp
    Timestamp takeownedAt = Timestamp.from(zonedDateTime.toInstant());
    this.directoryRepository.updateTakeownedAtById(directoryId, takeownedAt);
  }
}
