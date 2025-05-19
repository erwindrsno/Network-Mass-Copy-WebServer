package org.directory;

import com.google.inject.AbstractModule;

public class DirectoryModule extends AbstractModule {
  @Override
  protected void configure() {
    bind(DirectoryService.class).to(DirectoryServiceImpl.class);
    bind(DirectoryRepository.class).to(DirectoryRepositoryImpl.class);
  }
}
