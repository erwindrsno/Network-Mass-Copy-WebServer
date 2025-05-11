package org.entry;

import java.util.List;

import org.computer.ComputerService;
import org.file_record.FileRecord;
import org.file_record.FileRecordService;
import org.file_record_computer.FileRecordComputer;
import org.file_record_computer.FileRecordComputerService;
import org.joined_entry_file_filecomputer.CustomDtoOne;
import org.joined_entry_file_filecomputer.CustomDtoOneService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.websocket.FileAccessInfo;
import org.websocket.WebSocketClientService;

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
  private final CustomDtoOneService customDtoOneService;
  private final WebSocketClientService wsClientService;

  @Inject
  public EntryController(EntryService entryService, FileRecordService fileRecordService,
      ComputerService computerService, FileRecordComputerService fileRecordComputerService,
      CustomDtoOneService customDtoOneService, WebSocketClientService wsClientService) {
    this.entryService = entryService;
    this.fileRecordService = fileRecordService;
    this.computerService = computerService;
    this.fileRecordComputerService = fileRecordComputerService;
    this.customDtoOneService = customDtoOneService;
    this.wsClientService = wsClientService;
  }

  public void insertEntry(Context ctx) {
    String title = ctx.formParam("title");
    Integer count = Integer.parseInt(ctx.formParam("count"));

    // Insert ke entitas entry, yang akan return id-nya
    Entry entry = new Entry(null, title, "0/" + count, "0/" + count, false, count, null, 1);
    if (ctx.path().equals("/entry/oxam")) {
      entry.setFromOxam(true);
    }
    Integer entryId = this.entryService.createEntry(entry);

    // Penyediaan folder file yang akan dicopy ke clients
    StringBuilder baseFolder = new StringBuilder("upload/");
    String folderName = baseFolder.append(entryId).append("/").toString();

    // File yang dikirimkan oleh client akan di simpan di folder upload/${title
    // entry nya}/FILESSSSSS
    ctx.uploadedFiles("files")
        .forEach(uploadedFile -> FileUtil.streamToFile(uploadedFile.content(),
            folderName + uploadedFile.filename()));

    // baca JSON yang isinya array of entries, dan ekstrak data tersebut dan
    // disimpan dalam vairabel
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode root = objectMapper.readTree(ctx.formParam("records"));

      for (JsonNode receivedFileRecord : root) {
        String hostname = receivedFileRecord.get("hostname").asText();
        String owner = receivedFileRecord.get("owner").asText();
        int permissions = receivedFileRecord.get("permissions").asInt();

        for (UploadedFile uploadedFile : ctx.uploadedFiles("files")) {
          String filePath = "D\\Ujian\\" + owner + " - " + title + "\\" + uploadedFile.filename();

          FileRecord fileRecord = FileRecord.builder()
              .owner(owner)
              .permissions(permissions)
              .path(filePath)
              .filename(uploadedFile.filename())
              .build();

          Integer fileRecordId = this.fileRecordService.createFileRecord(fileRecord);
          Integer computerId = this.computerService.getComputersByHostname(hostname).getId();

          FileRecordComputer fileRecordComputer = FileRecordComputer.builder()
              .id(fileRecordId)
              .computerId(computerId)
              .build();
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

  public void getFileRecordByEntryId(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    // this.fileRecordService.getAllFiles
  }

  public void getJoinedFileRecordByEntryIdAndFilename(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    String filename = ctx.pathParam("filename");
    ctx.json(this.customDtoOneService.getJoinedFileRecordsDtoByEntryIdAndFilename(entryId, filename));
  }

  public void copyFileByEntry(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    String title = this.entryService.getTitleByEntryId(entryId);
    this.customDtoOneService.getMetadataByEntryId(entryId);
    // path, owner, permissions, ip address/hostname
    // atribute di atas harus assign ke filemetadata
    List<FileAccessInfo> listFai = this.customDtoOneService.getMetadataByEntryId(entryId);
    this.wsClientService.prepareMetadata(entryId, title, listFai);
  }
}
