package org.entry;

import org.file_record.FileRecordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import io.javalin.http.Context;
import io.javalin.util.FileUtil;

@Singleton
public class EntryController {
  private Logger logger = LoggerFactory.getLogger(EntryController.class);
  private final EntryService entryService;
  private final FileRecordService fileRecordService;

  @Inject
  public EntryController(EntryService entryService, FileRecordService fileRecordService) {
    this.entryService = entryService;
    this.fileRecordService = fileRecordService;
  }

  public void insertEntry(Context ctx) {
    String title = ctx.formParam("title");
    logger.info("Title is: " + title);

    String completeness = null;
    Entry entry = new Entry(null, title, completeness, 1);
    // Integer entryId = this.entryService.createEntry(entry);
    Integer entryId = 15;
    logger.info("entry id: " + entryId);

    StringBuilder baseFolder = new StringBuilder("upload/");
    String folderName = baseFolder.append(title).append("/").toString();
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      JsonNode root = objectMapper.readTree(ctx.formParam("entries"));

      for (JsonNode fileRecord : root) {
        String name = fileRecord.get("owner").asText();

        System.out.println("User: " + name);
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }

    // ctx.uploadedFiles("files")
    // .forEach(uploadedFile -> FileUtil.streamToFile(uploadedFile.content(),
    // folderName + uploadedFile.filename()));
    // logger.info(ctx.formParam("entries"));
  }

  public void getAllEntries(Context ctx) {
    ctx.json(this.entryService.getAllEntries());
  }
}
