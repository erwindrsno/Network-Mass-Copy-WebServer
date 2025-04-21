package org.file_record_computer;

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
}
