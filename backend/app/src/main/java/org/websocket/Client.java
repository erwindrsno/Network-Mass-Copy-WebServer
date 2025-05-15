package org.websocket;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.Map;

import org.entry.EntryService;
import org.file_record_computer.FileRecordComputerService;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft;
import org.java_websocket.handshake.ServerHandshake;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.inject.Inject;

public class Client extends WebSocketClient {
  Logger logger = LoggerFactory.getLogger(Client.class);

  private Context context;
  private ObjectMapper mapper;

  private FileRecordComputerService fileRecordComputerService;
  private EntryService entryService;

  public Client(URI serverUri, Draft draft) {
    super(serverUri, draft);
    this.mapper = new ObjectMapper();
  }

  public Client(URI serverURI) {
    super(serverURI);
    this.mapper = new ObjectMapper();
  }

  @Inject
  public void injectDependencies(FileRecordComputerService fileRecordComputerService, EntryService entryService) {
    this.fileRecordComputerService = fileRecordComputerService;
    this.entryService = entryService;
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

      FileChunkMetadata requestedFcm = this.context.getListFcm().stream()
          .filter(fcm -> fcm.getUuid().equals(requestedFileUuid))
          .findFirst()
          .orElseThrow(() -> new RuntimeException("No file found."));

      byte[] arrOfBytes = requestedFcm.getMapOfChunks().get(chunkId);
      ByteBuffer byteBuffer = ByteBuffer.wrap(arrOfBytes);
      send(byteBuffer);
    } else if (message.startsWith("ok/")) {
      try {
        this.mapper.enable(SerializationFeature.INDENT_OUTPUT); // pretty print
        String json = message.substring(3);
        logger.info(json);
        Map<String, String> jsonMap = this.mapper.readValue(json, new TypeReference<Map<String, String>>() {
        });
        Integer entryId = Integer.parseInt(jsonMap.get("entry_id"));
        Integer fileId = Integer.parseInt(jsonMap.get("file_id"));
        String ip_addr = jsonMap.get("ip_addr");
        logger.info("updating copy status");
        this.fileRecordComputerService.updateCopyStatus(entryId, ip_addr, fileId);

        send("webserver/to-webclient/refetch");
      } catch (Exception e) {
        logger.error(e.getMessage(), e);
      }
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
