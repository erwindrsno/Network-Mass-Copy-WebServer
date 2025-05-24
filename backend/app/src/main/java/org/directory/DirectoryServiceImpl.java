package org.directory;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.computer.Computer;
import org.computer.ComputerService;
import org.file_record.FileRecord;
import org.file_record.FileRecordService;
import org.util.TimeUtil;
import org.joined_entry_file_filecomputer.CustomDtoOne;
import org.joined_entry_file_filecomputer.CustomDtoOneService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class DirectoryServiceImpl implements DirectoryService {
  private Logger logger = LoggerFactory.getLogger(DirectoryServiceImpl.class);
  private final DirectoryRepository directoryRepository;
  private final CustomDtoOneService customDtoOneService;
  private final ComputerService computerService;

  @Inject
  public DirectoryServiceImpl(DirectoryRepository directoryRepository, FileRecordService fileRecordService,
      CustomDtoOneService customDtoOneService, ComputerService computerService) {
    this.directoryRepository = directoryRepository;
    this.customDtoOneService = customDtoOneService;
    this.computerService = computerService;
  }

  @Override
  public Integer createDirectory(Directory dir) {
    return this.directoryRepository.save(dir);
  }

  @Override
  public Integer getFileCopiedCountById(Integer directoryId) {
    return this.directoryRepository.findCopiedById(directoryId);
  }

  @Override
  public void updateFileCopiedCountById(Integer directoryId) {
    this.directoryRepository.updateCopiedById(directoryId);
  }

  @Override
  public void updateTakeownedAtById(Integer directoryId) {
    Timestamp takeownedAt = TimeUtil.nowTimestamp();
    this.directoryRepository.updateTakeownedAtById(directoryId, takeownedAt);
  }

  @Override
  public void updateDeletedAtById(Integer directoryId) {
    Timestamp deletedAt = TimeUtil.nowTimestamp();
    this.directoryRepository.updateDeletedAtById(directoryId, deletedAt);
  }

  @Override
  public void createDirectoryByEntryId(Integer entryId, Integer labNum, Integer hostNum, String owner) {
    List<CustomDtoOne> listFileRecord = this.customDtoOneService.getFileRecordMetadataByEntryId(entryId);
    String title = listFileRecord.get(0).getEntry().getTitle();
    String basePath = listFileRecord.get(0).getEntry().getBasePath();
    String dirPath = basePath + owner + " - " + title;
    Integer fileCount = listFileRecord.get(0).getDirectory().getFileCount();
    Directory dir = Directory.builder()
        .path(dirPath)
        .owner(owner)
        .fileCount(fileCount)
        .copied(0)
        .build();
    Integer dirId = this.directoryRepository.save(dir);

    String hostname = hostNum >= 10 ? "LAB0" + labNum + "-" + hostNum : "LAB0" + labNum + "-" + "0" + hostNum;

    Computer computer = this.computerService.getComputersByHostname(hostname);
    Integer compId = computer.getId();

    try {
      List<FileRecord> toBeInsertedList = new ArrayList<>();
      for (CustomDtoOne cdo : listFileRecord) {
        String filePath = cdo.getEntry().getBasePath() + owner + " - " + cdo.getEntry().getTitle() + "\\"
            + cdo.getFileRecord().getFilename();
        FileRecord fileRecord = FileRecord.builder()
            .owner(owner)
            .path(filePath)
            .filesize(cdo.getFileRecord().getFilesize())
            .filename(cdo.getFileRecord().getFilename())
            .entryId(entryId)
            .permissions(cdo.getFileRecord().getPermissions())
            .directoryId(dirId)
            .build();

        toBeInsertedList.add(fileRecord);
      }
      this.customDtoOneService.insertFileRecordsAndFileRecordsComputerByDirectoryId(dirId,
          compId, toBeInsertedList);
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }

  }
}
