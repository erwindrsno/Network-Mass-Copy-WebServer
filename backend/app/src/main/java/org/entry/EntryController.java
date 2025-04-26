package org.entry;

import org.file_record.FileRecordService;
import org.file_record_computer.FileRecordComputer;
import org.file_record_computer.FileRecordComputerService;

import java.sql.Timestamp;

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
  private final FileRecordComputerService fileRecordComputerService;

  @Inject
  public EntryController(EntryService entryService, FileRecordService fileRecordService,
      ComputerService computerService, FileRecordComputerService fileRecordComputerService) {
    this.entryService = entryService;
    this.fileRecordService = fileRecordService;
    this.computerService = computerService;
    this.fileRecordComputerService = fileRecordComputerService;
  }

  public void insertEntry(Context ctx) {
    String title = ctx.formParam("title");

    // Insert ke entitas entry, yang akan return id-nya
    Entry entry = new Entry(null, title, "NOT DONE", false, null, 1, null);
    if (ctx.path().equals("/entry/oxam")) {
      entry.setFromOxam(true);
    }
    Integer entryId = this.entryService.createEntry(entry);

    // Penyediaan folder file yang akan dicopy ke clients
    StringBuilder baseFolder = new StringBuilder("upload/");
    String folderName = baseFolder.append(title).append("/").toString();

    // File yang dikirimkan oleh client akan di simpan di folder upload/${title
    // entry nya}/FILESSSSSS
    ctx.uploadedFiles("files")
        .forEach(uploadedFile -> FileUtil.streamToFile(uploadedFile.content(),
            folderName + uploadedFile.filename()));

    // baca JSON yang isinya array of entries, dan ekstrak data tersebut dan
    // disimpan dalam vairabel
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode root = objectMapper.readTree(ctx.formParam("entries"));

      for (JsonNode receivedFileRecord : root) {
        String hostname = receivedFileRecord.get("hostname").asText();
        String owner = receivedFileRecord.get("owner").asText();
        int permissions = receivedFileRecord.get("permissions").asInt();

        for (UploadedFile uploadedFile : ctx.uploadedFiles("files")) {
          String filePath = "D/ujian/" + title + "/" + uploadedFile.filename();
          FileRecord fileRecord = new FileRecord(owner, permissions, filePath, uploadedFile.filename(),
              uploadedFile.size(), entryId);
          Integer fileRecordId = this.fileRecordService.createFileRecord(fileRecord);
          Integer computerId = this.computerService.getComputersByHostname(hostname).getId();

          FileRecordComputer fileRecordComputer = new FileRecordComputer(null, null, false, fileRecordId, computerId);
          this.fileRecordComputerService.createFileRecordComputer(fileRecordComputer);
          ctx.status(200);
        }
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
  }

  public void getAllEntries(Context ctx) {
    ctx.json(this.entryService.getAllEntries());
  }

  public void getFileInfo(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    ctx.json(this.fileRecordService.getFileInfo(entryId));
  }
}
