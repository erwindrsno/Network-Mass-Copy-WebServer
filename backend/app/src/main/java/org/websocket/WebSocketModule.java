package org.websocket;

import java.net.URI;

import org.java_websocket.client.WebSocketClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import com.google.inject.name.Names;

import io.github.cdimascio.dotenv.Dotenv;

public class WebSocketModule extends AbstractModule {
  @Override
  protected void configure() {
    Dotenv dotenv = Dotenv.configure().load();
    bind(Dotenv.class).toInstance(dotenv); // make Dotenv available everywhere
    bind(String.class).annotatedWith(Names.named("host")).toInstance(dotenv.get("LOCAL_WEBSOCKET_IP"));
    bind(Integer.class).annotatedWith(Names.named("port")).toInstance(Integer.parseInt(dotenv.get("PORT")));
    bind(WebSocketClientService.class).to(WebSocketClientServiceImpl.class);
  }

  @Provides
  @Singleton
  public Logger provideLogger() {
    Logger logger = LoggerFactory.getLogger(WebSocketModule.class);
    return logger;
  }

  @Provides
  @Singleton
  public Client provideClient(Logger logger, @Named("host") String host, @Named("port") int port) {
    try {
      String strUri = "ws://" + host + ":" + port;
      return new Client(new URI(strUri));
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

  @Provides
  @Singleton
  public WebSocketClient provideWebSocketClient(Client client, Logger logger) {
    try {
      return client;
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

}
