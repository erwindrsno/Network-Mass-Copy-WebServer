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

import org.directory.DirectoryService;
import org.entry.EntryService;
import org.file_record.FileRecordService;
import org.file_record_computer.FileRecordComputerService;
import org.joined_entry_file_filecomputer.AccessInfo;
import org.main.SseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.hash.Hashing;
import com.google.inject.Inject;

public class WebSocketClientServiceImpl implements WebSocketClientService {
  private final Client wsClient;
  private Logger logger = LoggerFactory.getLogger(WebSocketClientService.class);

  @Inject
  public WebSocketClientServiceImpl(Client wsClient, FileRecordComputerService fileRecordComputerService,
      EntryService entryService, DirectoryService directoryService, SseService sseService) {
    this.wsClient = wsClient;
    this.wsClient.injectDependencies(fileRecordComputerService, entryService,
        directoryService, sseService);
  }

  @Override
  public void prepareCopyMetadata(Integer entryId, AccessInfo accessInfo) {
    Path basePath = Paths.get("upload/" + entryId);
    List<FileChunkMetadata> listFileChunkMetadata = new ArrayList<>();

    try {
      Files.walk(basePath).forEach(path -> {
        if (!Files.isDirectory(path)) {
          try (FileInputStream fileInputStream = new FileInputStream(path.toFile())) {
            int chunkSize = 10240;
            byte[] buffer = new byte[chunkSize];
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
          .listFai(accessInfo.getListFai())
          .listDai(accessInfo.getListDai())
          .listFcm(listFileChunkMetadata)
          .build();

      this.wsClient.setContextAndInitSend(context, "copy");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @Override
  public void prepareSingleCopyMetadata(Integer entryId, AccessInfo accessInfo) {
    List<DirectoryAccessInfo> listDai = accessInfo.getListDai();
    List<FileAccessInfo> listFai = accessInfo.getListFai();
    Path path = Paths.get("upload/" + entryId + "/" + listFai.get(0).getFilename());
    List<FileChunkMetadata> listFileChunkMetadata = new ArrayList<>();

    try {
      if (!Files.isDirectory(path)) {
        try (FileInputStream fileInputStream = new FileInputStream(path.toFile())) {
          int chunkSize = 10240;
          byte[] buffer = new byte[chunkSize];
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

      Context context = Context.builder()
          .entryId(entryId)
          .listFai(listFai)
          .listDai(listDai)
          .listFcm(listFileChunkMetadata)
          .build();

      this.wsClient.setContextAndInitSend(context, "copy");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @Override
  public void prepareTakeownMetadata(Integer entryId, AccessInfo accessInfo) {
    try {
      Context context = Context.builder()
          .entryId(entryId)
          .listFai(accessInfo.getListFai())
          .listDai(accessInfo.getListDai())
          .build();

      this.wsClient.setContextAndInitSend(context, "takeown");
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }

  @Override
  public void prepareDeleteMetadata(Integer entryId, AccessInfo accessInfo) {
    try {
      Context context = Context.builder()
          .entryId(entryId)
          .listFai(accessInfo.getListFai())
          .listDai(accessInfo.getListDai())
          .build();

      logger.info("try deleting...");
      this.wsClient.setContextAndInitSend(context, "delete");
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }

  @Override
  public void prepareSingleDeleteMetadata(Integer entryId, AccessInfo accessInfo) {
    try {
      Context context = Context.builder()
          .entryId(entryId)
          .listFai(accessInfo.getListFai())
          .listDai(accessInfo.getListDai())
          .build();

      logger.info("try deleting...");
      this.wsClient.setContextAndInitSend(context, "single-delete");
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }
}
