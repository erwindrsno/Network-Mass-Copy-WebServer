package org.file_record_computer;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.util.TimeUtil;

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
  public void updateCopiedAt(String ip_addr, Integer fileId) {
    Timestamp copiedAt = TimeUtil.nowTimestamp();
    this.fileRecordComputerRepository.updateCopiedAtByFileId(ip_addr, fileId, copiedAt);
  }

  @Override
  public void bulkCreate(List<FileRecordComputer> listFileRecordComputer) {
    this.fileRecordComputerRepository.bulkSave(listFileRecordComputer);
  }
}
