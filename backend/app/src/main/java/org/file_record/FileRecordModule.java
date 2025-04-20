package org.file_record;

import com.google.inject.AbstractModule;

public class FileRecordModule extends AbstractModule {
  @Override
  protected void configure() {
    bind(FileRecordService.class).to(FileRecordServiceImpl.class);
    bind(FileRecordRepository.class).to(FileRecordRepositoryImpl.class);
  }
}
