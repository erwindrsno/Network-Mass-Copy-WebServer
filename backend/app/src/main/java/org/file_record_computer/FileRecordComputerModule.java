package org.file_record_computer;

import com.google.inject.AbstractModule;

public class FileRecordComputerModule extends AbstractModule {
  @Override
  protected void configure() {
    bind(FileRecordComputerService.class).to(FileRecordComputerServiceImpl.class);
    bind(FileRecordComputerRepository.class).to(FileRecordComputerRepositoryImpl.class);
  }
}
