package org.websocket;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;

import java.net.URI;

import org.java_websocket.client.WebSocketClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebSocketModule extends AbstractModule {
  @Override
  protected void configure() {
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
  public Client provideClient(Logger logger) {
    try {
      return new Client(new URI("ws://192.168.0.106:8887"));
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
