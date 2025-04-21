package org.entry;

import org.file_record.FileRecordService;
import org.computer.ComputerService;
import org.file_record.FileRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import io.javalin.http.Context;
import io.javalin.http.UploadedFile;
import io.javalin.util.FileUtil;

@Singleton
public class EntryController {
  private Logger logger = LoggerFactory.getLogger(EntryController.class);
  private final EntryService entryService;
  private final FileRecordService fileRecordService;
  private final ComputerService computerService;

  @Inject
  public EntryController(EntryService entryService, FileRecordService fileRecordService,
      ComputerService computerService) {
    this.entryService = entryService;
    this.fileRecordService = fileRecordService;
    this.computerService = computerService;
  }

  public void insertEntry(Context ctx) {
    String title = ctx.formParam("title");

    // Insert ke entitas entry, yang akan return id-nya
    Entry entry = new Entry(null, title, null, 1);
    Integer entryId = this.entryService.createEntry(entry);

    // Penyediaan folder file yang akan dicopy ke clients
    StringBuilder baseFolder = new StringBuilder("upload/");
    String folderName = baseFolder.append(title).append("/").toString();

    // File yang dikirimkan oleh client akan di simpan di folder upload/${title
    // entry nya}/FILESSSSSS
    ctx.uploadedFiles("files")
        .forEach(uploadedFile -> FileUtil.streamToFile(uploadedFile.content(),
            folderName + uploadedFile.filename()));

    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode root = objectMapper.readTree(ctx.formParam("entries"));

      for (JsonNode receivedFileRecord : root) {
        String hostname = receivedFileRecord.get("hostname").asText();
        String owner = receivedFileRecord.get("owner").asText();
        int permissions = receivedFileRecord.get("permissions").asInt();

        for (UploadedFile uploadedFile : ctx.uploadedFiles("files")) {
          FileRecord fileRecord = new FileRecord(owner, permissions, "D/ujian/" + title + "/" + uploadedFile.filename(),
              entryId);
          Integer fileRecordId = this.fileRecordService.createFileRecord(fileRecord);
          // logger.info("file record id is: " + fileRecordId);
          Integer computerId = this.computerService.getComputersByHostname(hostname).getId();
          this.fileRecordCompu
        }
        // logger.info("hostname : " + hostname);
        // logger.info("owner : " + owner);
        // logger.info("permissions : " + permissions);
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
  }

  public void getAllEntries(Context ctx) {
    ctx.json(this.entryService.getAllEntries());
  }
}
