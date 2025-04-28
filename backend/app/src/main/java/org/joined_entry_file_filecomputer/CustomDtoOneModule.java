package org.joined_entry_file_filecomputer;

import com.google.inject.AbstractModule;

public class CustomDtoOneModule extends AbstractModule {
  @Override
  protected void configure() {
    bind(CustomDtoOneService.class).to(CustomDtoOneServiceImpl.class);
    bind(CustomDtoOneRepository.class).to(CustomDtoOneRepositoryImpl.class);
  }
}
