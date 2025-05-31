package org.main;

import io.javalin.http.sse.SseClient;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

public class SseService {
  private final Queue<SseClient> clients = new ConcurrentLinkedQueue<>();

  public void addClient(SseClient client) {
    client.keepAlive();
    client.onClose(() -> clients.remove(client));
    clients.add(client);
  }

  public void broadcast(String eventName, String data) {
    for (SseClient client : clients) {
      client.sendEvent(eventName, data);
    }
  }

  public void send(SseClient client, String eventName, String data) {
    client.sendEvent(eventName, data);
  }

  public int getClientCount() {
    return clients.size();
  }
}
