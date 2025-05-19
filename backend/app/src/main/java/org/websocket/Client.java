package org.websocket;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;

import org.directory.DirectoryService;
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
  private DirectoryService directoryService;

  public Client(URI serverUri, Draft draft) {
    super(serverUri, draft);
    this.mapper = new ObjectMapper();
  }

  public Client(URI serverURI) {
    super(serverURI);
    this.mapper = new ObjectMapper();
  }

  @Inject
  public void injectDependencies(FileRecordComputerService fileRecordComputerService, EntryService entryService,
      DirectoryService directoryService) {
    this.fileRecordComputerService = fileRecordComputerService;
    this.entryService = entryService;
    this.directoryService = directoryService;
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
        String json = message.substring(3);
        Map<String, String> jsonMap = this.mapper.readValue(json, new TypeReference<Map<String, String>>() {
        });
        Integer fileId = Integer.parseInt(jsonMap.get("file_id"));
        String ip_addr = jsonMap.get("ip_addr");
        this.fileRecordComputerService.updateCopiedAt(ip_addr, fileId);
      } catch (Exception e) {
        logger.error(e.getMessage(), e);
      }
    } else if (message.startsWith("fin/")) {
      String action = message.substring(4);
      if (action.startsWith("copy/")) {
        try {
          Integer directoryId = Integer.parseInt(action.substring(5));
          this.directoryService.updateFileCopiedCountById(directoryId);

          send("webserver/to-webclient/refetch");
        } catch (Exception e) {
          logger.error(e.getMessage(), e);
        }
      } else if (action.startsWith("takeown/")) {
        try {
          Integer directoryId = Integer.parseInt(action.substring(8));
          this.directoryService.updateTakeownedAtById(directoryId);

          send("webserver/to-webclient/refetch");
        } catch (Exception e) {
          logger.error(e.getMessage(), e);
        }
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

  public void setContextAndInitSend(Context context, boolean isCopy) {
    this.context = context;

    try {
      ObjectMapper mapper = new ObjectMapper();
      String message = isCopy ? "webserver/metadata/copy/" : "webserver/metadata/takeown/";
      String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(this.context);
      mapper.enable(SerializationFeature.INDENT_OUTPUT);
      send(message + "" + json);
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }
}
