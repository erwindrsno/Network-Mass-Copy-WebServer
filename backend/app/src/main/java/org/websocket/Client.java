package org.websocket;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft;
import org.java_websocket.handshake.ServerHandshake;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Client extends WebSocketClient {
  Logger logger = LoggerFactory.getLogger(Client.class);

  boolean readyToReceiveFile = false;

  byte[] fileBytes; // complete file in bytes
  int currIdx = 0;
  long fileSize;
  long chunkSize;
  long chunkCount;

  Map<Integer, byte[]> bytesMap = new HashMap<>();
  int bytesIdx = 0;

  public Client(URI serverUri, Draft draft) {
    super(serverUri, draft);
  }

  public Client(URI serverURI) {
    super(serverURI);
  }

  @Override
  public void onOpen(ServerHandshake handshakedata) {
    logger.info("Connected to server : " + handshakedata.getHttpStatusMessage());
  }

  @Override
  public void onMessage(String message) {
    logger.info(message);
  }

  @Override
  public void onMessage(ByteBuffer buffer) {
  }

  @Override
  public void onClose(int code, String reason, boolean remote) {
    System.out.println("closed with exit code " + code + " additional info: " + reason);
  }

  @Override
  public void onError(Exception ex) {
    System.err.println("an error occurred:" + ex);
  }
}
