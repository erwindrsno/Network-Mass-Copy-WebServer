package org.websocket;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft;
import org.java_websocket.handshake.ServerHandshake;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;

public class Client extends WebSocketClient {
  Logger logger = LoggerFactory.getLogger(Client.class);

  Context context;

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
    if (message.startsWith("file~")) {
      String[] parts = message.split("CHUNK-ID~");

      String leftPart = parts[0]; // "file~5"
      String rightPart = parts[1]; // "10"

      String requestedFileUuid = leftPart.split("~")[1];
      Long chunkId = Long.parseLong(rightPart);
      logger.info("receiveFileUuid: " + requestedFileUuid);
      logger.info("chunkId: " + chunkId);

      FileChunkMetadata requestedFcm = this.context.listFcm.stream()
          .filter(fcm -> fcm.getUuid().equals(requestedFileUuid))
          .findFirst()
          .orElseThrow(() -> new RuntimeException("No file found."));

      byte[] arrOfBytes = requestedFcm.getMapOfChunks().get(chunkId);
      ByteBuffer byteBuffer = ByteBuffer.wrap(arrOfBytes);
      send(byteBuffer);
    }
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

  public void setContextAndInitSend(Context context) {
    this.context = context;

    try {
      ObjectMapper mapper = new ObjectMapper();
      String json = mapper.writeValueAsString(this.context);
      send("webserver/metadata/" + json);
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }
}
