package org.file_record_computer;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class FileRecordComputerServiceImpl implements FileRecordComputerService {
  private final FileRecordComputerRepository fileRecordComputerRepository;

  @Inject
  public FileRecordComputerServiceImpl(FileRecordComputerRepository fileRecordComputerRepository) {
    this.fileRecordComputerRepository = fileRecordComputerRepository;
  }

  @Override
  public void createFileRecordComputer(FileRecordComputer fileRecordComputer) {
    this.fileRecordComputerRepository.save(fileRecordComputer);
  }

  @Override
  public void setCopyTimestamp(Integer entryId) {
    // ambil zona waktu, yaitu UTC+7
    ZoneId zoneId = ZoneId.of("UTC+7");
    // ambil waktu saat pembuatan entri sesuai dengan zona waktu
    ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);

    // konversi waktu ke tipe data time stamp
    Timestamp copiedAt = Timestamp.from(zonedDateTime.toInstant());

    this.fileRecordComputerRepository.updateCopyTimestampByEntryId(entryId, copiedAt);
  }

  @Override
  public void updateCopiedAt(String ip_addr, Integer fileId) {
    // ambil zona waktu, yaitu UTC+7
    ZoneId zoneId = ZoneId.of("UTC+7");
    // ambil waktu saat pembuatan entri sesuai dengan zona waktu
    ZonedDateTime zonedDateTime = ZonedDateTime.now(zoneId);

    // konversi waktu ke tipe data time stamp
    Timestamp copiedAt = Timestamp.from(zonedDateTime.toInstant());
    this.fileRecordComputerRepository.updateCopiedAt(ip_addr, fileId, copiedAt);
  }

  @Override
  public void deleteByEntryId(Integer entryId) {
    this.fileRecordComputerRepository.destroyByEntryId(entryId);
  }
}
