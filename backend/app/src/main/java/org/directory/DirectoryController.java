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
  private final WebSocketClientService wsClientService;
  private final CustomDtoOneService customDtoOneService;

  @Inject
  public DirectoryController(DirectoryService directoryService, WebSocketClientService wsClientService,
      CustomDtoOneService customDtoOneService) {
    this.directoryService = directoryService;
    this.wsClientService = wsClientService;
    this.customDtoOneService = customDtoOneService;
  }

  public void copyFilesByDirectoryId(Context ctx) {
    Integer directoryId = Integer.parseInt(ctx.pathParam("directory_id"));
    Integer entryId = Integer.parseInt(ctx.formParam("entry_id"));
    AccessInfo accessInfo = this.customDtoOneService.getMetadataByDirectoryId(directoryId);
    this.wsClientService.prepareCopyMetadata(entryId, accessInfo);
  }

  public void takeownByDirectoryId(Context ctx) {
    Integer directoryId = Integer.parseInt(ctx.pathParam("directory_id"));
    Integer entryId = Integer.parseInt(ctx.formParam("entry_id"));
    AccessInfo accessInfo = this.customDtoOneService.getMetadataByDirectoryId(directoryId);
    this.wsClientService.prepareTakeownMetadata(entryId, accessInfo);
  }

  public void getFileRecordByDirectoryId(Context ctx) {
    Integer directoryId = Integer.parseInt(ctx.pathParam("directory_id"));
    ctx.json(this.customDtoOneService.getFileRecordByDirectoryId(directoryId));
  }

  public void deleteByDirectoryId(Context ctx) {
    Integer directoryId = Integer.parseInt(ctx.pathParam("directory_id"));
    Integer entryId = Integer.parseInt(ctx.formParam("entry_id"));
    AccessInfo accessInfo = this.customDtoOneService.getMetadataByDirectoryId(directoryId);
    this.wsClientService.prepareDeleteMetadata(entryId, accessInfo);
  }

  public void createDirectoryByEntryId(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.formParam("entry_id"));
    Integer labNum = Integer.parseInt(ctx.formParam("lab_num"));
    Integer hostNum = Integer.parseInt(ctx.formParam("host_num"));
    String owner = ctx.formParam("owner");
    this.directoryService.createDirectoryByEntryId(entryId, labNum, hostNum,
        owner);
  }
}
