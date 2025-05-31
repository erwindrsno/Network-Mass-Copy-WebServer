
package org.main;

import com.google.inject.AbstractModule;
import com.google.inject.Singleton;

import org.slf4j.*;

public class MainModule extends AbstractModule {
  private static Logger logger = LoggerFactory.getLogger(MainModule.class);

  @Override
  protected void configure() {
    bind(DatabaseConfig.class).in(Singleton.class);
    bind(SseService.class).in(Singleton.class);
  }
}
