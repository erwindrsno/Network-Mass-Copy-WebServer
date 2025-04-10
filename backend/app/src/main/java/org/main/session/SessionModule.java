package org.main.session;

import com.google.inject.AbstractModule;
import com.google.inject.Singleton;

import org.slf4j.*;

public class SessionModule extends AbstractModule {
    private static Logger logger = LoggerFactory.getLogger(SessionModule.class);

    @Override
    protected void configure() {
        bind(SessionConfig.class).in(Singleton.class);
    }
}
