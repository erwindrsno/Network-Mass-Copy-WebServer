package org.file_record;

import java.io.InputStream;
import java.net.http.WebSocket;
import java.util.List;

import org.directory.DirectoryService;
import org.joined_entry_file_filecomputer.AccessInfo;
import org.joined_entry_file_filecomputer.CustomDtoOneService;
import org.joined_entry_file_filecomputer.CustomDtoOneServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.websocket.FileAccessInfo;
import org.websocket.WebSocketClientService;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import io.javalin.http.Context;
import io.javalin.util.FileUtil;

@Singleton
public class FileRecordController {
  private Logger logger = LoggerFactory.getLogger(FileRecordController.class);
  private final FileRecordService fileRecordService;
  private final CustomDtoOneService customDtoOneService;
  private final WebSocketClientService wsClientService;
  private final DirectoryService directoryService;

  @Inject
  public FileRecordController(FileRecordService fileRecordService, CustomDtoOneService customDtoOneService,
      WebSocketClientService wsClientService, DirectoryService directoryService) {
    this.fileRecordService = fileRecordService;
    this.customDtoOneService = customDtoOneService;
    this.wsClientService = wsClientService;
    this.directoryService = directoryService;
  }

  public void insertFiles(Context ctx) {
    ctx.uploadedFiles()
        .forEach(uploadedFile -> FileUtil.streamToFile(uploadedFile.content(), "upload/" + uploadedFile.filename()));
  }

  public void getFileInfo(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("entry_id"));
    ctx.json(this.fileRecordService.getFileInfo(entryId));
  }

  public void downloadFile(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("entry_id"));
    String filename = ctx.pathParam("filename");
    InputStream inputStream = this.fileRecordService.downloadFile(entryId, filename);

    if (inputStream == null) {
      ctx.status(404).result("Not found");
      return;
    }
    ctx.header("Content-Disposition", "attachment; filename=\"" + filename +
        "\"");
    ctx.contentType("application/octet-stream");
    try {
      ctx.result(inputStream);
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
  }

  public void copyFile(Context ctx) {
    Integer fileId = Integer.parseInt(ctx.pathParam("id"));
    Integer entryId = Integer.parseInt(ctx.pathParam("entry_id"));
    AccessInfo accessInfo = this.customDtoOneService.getMetadataByFileId(fileId);
    this.wsClientService.prepareSingleCopyMetadata(entryId, accessInfo);
  }
}
