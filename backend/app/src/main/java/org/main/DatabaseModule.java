
package org.main;

import com.google.inject.AbstractModule;
import com.google.inject.Singleton;

public class DatabaseModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(DatabaseConfig.class).in(Singleton.class);
    }
}
