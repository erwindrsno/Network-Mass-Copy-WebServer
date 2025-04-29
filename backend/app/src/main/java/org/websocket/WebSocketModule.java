package org.websocket;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;

import java.net.URI;

import org.java_websocket.client.WebSocketClient;

public class WebSocketModule extends AbstractModule {
  @Provides
  @Singleton
  public WebSocketClient provideWebSocketClient() {
    try {
      WebSocketClient client = new Client(new URI("ws://10.100.70.211:8887"));
      // need to investigate further
      client.connectBlocking();
      return client;
    } catch (Exception e) {
      throw new RuntimeException("failed 2 connect to websocket", e);
    }
  }
}
