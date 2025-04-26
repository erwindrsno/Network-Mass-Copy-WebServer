package org.websocket;

import java.net.URI;
import java.net.URISyntaxException;

import org.java_websocket.client.WebSocketClient;

/**
 * Hello world!
 */
public class WebSocketInit {
  public static void initConn() throws URISyntaxException {
    // System.out.println("Connecting to 192.168.0.102:8887");
    System.out.println("Connecting to localhost");
    // System.out.println("Connecting to 10.100.70.60:8887");
    // WebSocketClient client = new Client(new URI("ws://192.168.0.102:8887"));
    WebSocketClient client = new Client(new URI("ws://10.100.70.211:8887"));
    client.connect();
  }
}
