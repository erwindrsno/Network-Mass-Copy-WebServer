package org.websocket;

import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.entry.EntryService;
import org.file_record_computer.FileRecordComputerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.hash.Hashing;
import com.google.inject.Inject;

public class WebSocketClientServiceImpl implements WebSocketClientService {
  private final Client wsClient;
  private Logger logger = LoggerFactory.getLogger(WebSocketClientService.class);

  @Inject
  public WebSocketClientServiceImpl(Client wsClient, FileRecordComputerService fileRecordComputerService,
      EntryService entryService) {
    this.wsClient = wsClient;
    this.wsClient.injectDependencies(fileRecordComputerService, entryService);
  }

  @Override
  public void prepareMetadata(Integer entryId, String title, List<FileAccessInfo> listFai) {
    Path basePath = Paths.get("upload/" + entryId);
    List<FileChunkMetadata> listFileChunkMetadata = new ArrayList<>();

    try {
      Files.walk(basePath).forEach(path -> {
        if (!Files.isDirectory(path)) {
          try (FileInputStream fileInputStream = new FileInputStream(path.toFile())) {
            byte[] buffer = new byte[10240];
            int bytesRead;

            Map<Long, byte[]> chunks = new HashMap<>();

            Long idx = 0L;
            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
              byte[] copy = Arrays.copyOf(buffer, bytesRead);
              chunks.put(idx, copy);
              idx++;
            }

            String signature = Hashing.sha256().hashBytes(Files.readAllBytes(path)).toString();
            String filename = path.getFileName().toString();
            int chunkSize = 10240;

            long fileSize = Files.size(path);
            int chunkCount = (int) ((fileSize + chunkSize - 1) / chunkSize);

            String generatedUuid = UUID.randomUUID().toString();

            FileChunkMetadata fileChunkMetadata = FileChunkMetadata.builder()
                .uuid(generatedUuid)
                .filename(filename)
                .chunkCount(chunkCount)
                .signature(signature)
                .mapOfChunks(chunks)
                .build();

            listFileChunkMetadata.add(fileChunkMetadata);

          } catch (Exception e) {
            logger.error(e.getMessage(), e);
          }
        }
      });

      Context context = Context.builder()
          .entryId(entryId)
          .listFai(listFai)
          .listFcm(listFileChunkMetadata)
          .build();

      this.wsClient.setContextAndInitSend(context);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
