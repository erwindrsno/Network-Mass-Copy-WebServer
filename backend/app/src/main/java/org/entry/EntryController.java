package org.entry;

import org.computer.ComputerService;
import org.directory.Directory;
import org.directory.DirectoryService;
import org.file_record.FileRecord;
import org.file_record.FileRecordService;
import org.file_record_computer.FileRecordComputer;
import org.file_record_computer.FileRecordComputerService;
import org.joined_entry_file_filecomputer.AccessInfo;
import org.joined_entry_file_filecomputer.CustomDtoOneService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.user.UserService;
import org.websocket.WebSocketClientService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import io.javalin.http.Context;
import io.javalin.http.Handler;
import io.javalin.http.HandlerType;
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
  private final UserService userService;
  private final DirectoryService directoryService;

  @Inject
  public EntryController(EntryService entryService, FileRecordService fileRecordService,
      ComputerService computerService, FileRecordComputerService fileRecordComputerService,
      CustomDtoOneService customDtoOneService, WebSocketClientService wsClientService, UserService userService,
      DirectoryService directoryService) {
    this.entryService = entryService;
    this.fileRecordService = fileRecordService;
    this.computerService = computerService;
    this.fileRecordComputerService = fileRecordComputerService;
    this.customDtoOneService = customDtoOneService;
    this.wsClientService = wsClientService;
    this.userService = userService;
    this.directoryService = directoryService;
  }

  public void createEntry(Context ctx) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      String authHeader = ctx.header("Authorization");
      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        ctx.status(401).result("Missing or invalid Authorization header");
        logger.info("Invalid token");
      }

      String token = authHeader.substring("Bearer ".length());

      String title = ctx.formParam("title");
      Integer count = Integer.parseInt(ctx.formParam("count"));
      Integer dirCount = Integer.parseInt(ctx.formParam("host_count"));
      Integer userId = this.userService.getUserIdFromJWT(token);

      // Insert ke entitas entry, yang akan return id-nya
      Entry entry = Entry.builder()
          .title(title)
          .count(count)
          .isFromOxam(false)
          .userId(userId)
          .deleteFiles(false)
          .build();

      if (ctx.path().equals("/entry/oxam")) {
        entry.setFromOxam(true);
        entry.setBasePath("D:\\Ujian\\");
        logger.info("D:\\Ujian\\");
      } else {
        String basePath = ctx.formParam("path").toString();
        entry.setBasePath(basePath);
        logger.info(basePath);
      }

      Integer entryId = this.entryService.createEntry(entry);
      StringBuilder baseFolder = new StringBuilder("upload/");
      String folderName = baseFolder.append(entryId).append("/").toString();

      ctx.uploadedFiles("files")
          .forEach(uploadedFile -> FileUtil.streamToFile(uploadedFile.content(),
              folderName + uploadedFile.filename()));

      // baca JSON yang isinya array of records, dan ekstrak data tersebut dan
      // disimpan dalam vairabel
      JsonNode root = objectMapper.readTree(ctx.formParam("records"));

      for (JsonNode receivedFileRecord : root) {
        String hostname = receivedFileRecord.get("hostname").asText();
        String owner = receivedFileRecord.get("owner").asText();
        String permissions = "";
        if (ctx.path().equals("/entry/oxam") && ctx.method() == HandlerType.POST) {
          permissions += "111";
        } else if (ctx.path().equals("/entry") && ctx.method() == HandlerType.POST) {
          permissions += receivedFileRecord.get("permissions").asText();
        }

        // untuk tiap owner, dibkin direktorinya
        Directory dirPerOwner = Directory.builder()
            .path(entry.getBasePath() + owner + " - " + title)
            .copied(0)
            .owner(owner)
            .fileCount(ctx.uploadedFiles("files").size())
            .build();

        Integer directoryId = this.directoryService.createDirectory(dirPerOwner);

        for (UploadedFile uploadedFile : ctx.uploadedFiles("files")) {
          String filePath = "D:\\Ujian\\" + owner + " - " + title + "\\" +
              uploadedFile.filename();

          FileRecord fileRecord = FileRecord.builder()
              .owner(owner)
              .permissions(permissions)
              .path(filePath)
              .filename(uploadedFile.filename())
              .entryId(entryId)
              .filesize(uploadedFile.size())
              .directoryId(directoryId)
              .build();

          Integer fileRecordId = this.fileRecordService.createFileRecord(fileRecord);
          Integer computerId = this.computerService.getComputersByHostname(hostname).getId();

          FileRecordComputer fileRecordComputer = FileRecordComputer.builder()
              .fileRecordId(fileRecordId)
              .computerId(computerId)
              .build();
          this.fileRecordComputerService.createFileRecordComputer(fileRecordComputer);
          ctx.status(200);
        }
      }
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }

  public void getAllEntries(Context ctx) {
    ctx.json(this.entryService.getAllEntries());
  }

  public void getAllDeletedEntries(Context ctx) {
    ctx.json(this.entryService.getAllDeletedEntries());
  }

  public void getFile(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    ctx.json(this.fileRecordService.getFileInfo(entryId));
  }

  public void getFileRecordByEntryId(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    ctx.json(this.customDtoOneService.getJoinedFileRecordsDtoByEntryId(entryId));
  }

  public void copyFileByEntry(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    AccessInfo accessInfo = this.customDtoOneService.getMetadataByEntryId(entryId);
    this.wsClientService.prepareCopyMetadata(entryId, accessInfo);
  }

  public void softDeleteEntryById(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    this.fileRecordService.deleteFileById(entryId);
    Boolean shouldDeleteFilesInClients = this.entryService.getDeleteFilesFlagById(entryId);
    if (shouldDeleteFilesInClients) {
      AccessInfo accessInfo = this.customDtoOneService.getMetadataByEntryId(entryId);
      this.wsClientService.prepareDeleteMetadata(entryId, accessInfo);
    }
    this.entryService.softDeleteEntryById(entryId);
  }

  public void takeownFileByEntry(Context ctx) {
    Integer entryId = Integer.parseInt(ctx.pathParam("id"));
    AccessInfo accessInfo = this.customDtoOneService.getMetadataByEntryId(entryId);
    this.wsClientService.prepareTakeownMetadata(entryId, accessInfo);
  }
}
