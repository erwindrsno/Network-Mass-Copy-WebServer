
package org.main;

import com.google.inject.AbstractModule;
import com.google.inject.Singleton;

import org.main.session.SessionConfig;
import org.slf4j.*;

public class DatabaseModule extends AbstractModule {
    private static Logger logger = LoggerFactory.getLogger(DatabaseModule.class);

    @Override
    protected void configure() {
        bind(DatabaseConfig.class).in(Singleton.class);
    }
}
