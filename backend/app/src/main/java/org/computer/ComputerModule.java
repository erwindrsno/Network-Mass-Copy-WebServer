package org.computer;

import com.google.inject.AbstractModule;

public class ComputerModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(ComputerService.class).to(ComputerServiceImpl.class);
        bind(ComputerRepository.class).to(ComputerRepositoryImpl.class);
    }
}
