package org.entry;

import com.google.inject.AbstractModule;

public class EntryModule extends AbstractModule {
  @Override
  protected void configure() {
    bind(EntryService.class).to(EntryServiceImpl.class);
    bind(EntryRepository.class).to(EntryRepositoryImpl.class);
  }
}
