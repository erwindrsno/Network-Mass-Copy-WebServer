package org.file_record;

import java.util.List;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class FileRecordServiceImpl implements FileRecordService {
  private final FileRecordRepository fileRecordRepository;

  @Inject
  public FileRecordServiceImpl(FileRecordRepository fileRecordRepository) {
    this.fileRecordRepository = fileRecordRepository;
  }

  @Override
  public Integer createFileRecord(FileRecord fileRecord) {
    return this.fileRecordRepository.save(fileRecord);
  }
}
