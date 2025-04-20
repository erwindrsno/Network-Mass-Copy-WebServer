package org.file_record;

import com.google.inject.AbstractModule;

public class FileRecordModule extends AbstractModule {
  @Override
  protected void configure() {
    bind(FileService.class).to(FileServiceImpl.class);
    bind(FileRepository.class).to(FileRepositoryImpl.class);
  }
}
