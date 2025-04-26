package org.file_record;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import io.javalin.http.Context;
import io.javalin.util.FileUtil;

@Singleton
public class FileRecordController {
  private Logger logger = LoggerFactory.getLogger(FileRecordController.class);
  private final FileRecordService fileRecordService;

  @Inject
  public FileRecordController(FileRecordService fileRecordService) {
    this.fileRecordService = fileRecordService;
  }

  public void insertFiles(Context ctx) {
    ctx.uploadedFiles()
        .forEach(uploadedFile -> FileUtil.streamToFile(uploadedFile.content(), "upload/" + uploadedFile.filename()));
  }

  public void getFileInfo(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("entry_id"));
    ctx.json(this.fileRecordService.getFileInfo(entryId));
  }
}
