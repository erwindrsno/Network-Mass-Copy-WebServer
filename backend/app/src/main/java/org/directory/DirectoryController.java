package org.directory;

import org.file_record.FileRecordService;
import org.joined_entry_file_filecomputer.AccessInfo;
import org.joined_entry_file_filecomputer.CustomDtoOneService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.websocket.WebSocketClientService;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import io.javalin.http.Context;

@Singleton
public class DirectoryController {
  private Logger logger = LoggerFactory.getLogger(DirectoryController.class);
  private final DirectoryService directoryService;
  private final FileRecordService fileRecordService;
  private final WebSocketClientService wsClient;
  private final CustomDtoOneService customDtoOneService;

  @Inject
  public DirectoryController(DirectoryService directoryService, WebSocketClientService wsClient,
      CustomDtoOneService customDtoOneService, FileRecordService fileRecordService) {
    this.directoryService = directoryService;
    this.wsClient = wsClient;
    this.customDtoOneService = customDtoOneService;
    this.fileRecordService = fileRecordService;
  }

  public void copyFilesByDirectoryId(Context ctx) {
    Integer directoryId = Integer.parseInt(ctx.pathParam("directory_id"));
    Integer entryId = Integer.parseInt(ctx.pathParam("entry_id"));
    AccessInfo accessInfo = this.customDtoOneService.getMetadataByDirectoryId(directoryId);
    this.wsClient.prepareCopyMetadata(entryId, accessInfo);
  }

  public void takeownByDirectoryId(Context ctx) {
    Integer directoryId = Integer.parseInt(ctx.pathParam("directory_id"));
    Integer entryId = Integer.parseInt(ctx.pathParam("entry_id"));
    AccessInfo accessInfo = this.customDtoOneService.getMetadataByDirectoryId(directoryId);
    this.wsClient.prepareTakeownMetadata(entryId, accessInfo);
  }

  public void getFileRecordByDirectoryId(Context ctx) {
    Integer directoryId = Integer.parseInt(ctx.pathParam("directory_id"));
    ctx.json(this.customDtoOneService.getFileRecordByDirectoryId(directoryId));
  }
}
