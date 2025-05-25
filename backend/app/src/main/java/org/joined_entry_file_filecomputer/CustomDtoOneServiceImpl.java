package org.joined_entry_file_filecomputer;

import java.util.ArrayList;
import java.util.List;

import org.file_record.FileRecord;
import org.file_record.FileRecordService;
import org.file_record_computer.FileRecordComputer;
import org.file_record_computer.FileRecordComputerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class CustomDtoOneServiceImpl implements CustomDtoOneService {
  private final CustomDtoOneRepository customDtoOneRepository;
  private final FileRecordComputerService fileRecordComputerService;
  private final FileRecordService fileRecordService;
  private Logger logger = LoggerFactory.getLogger(CustomDtoOneService.class);

  @Inject
  public CustomDtoOneServiceImpl(CustomDtoOneRepository customDtoOneRepository,
      FileRecordComputerService fileRecordComputerService, FileRecordService fileRecordService) {
    this.customDtoOneRepository = customDtoOneRepository;
    this.fileRecordComputerService = fileRecordComputerService;
    this.fileRecordService = fileRecordService;
  }

  @Override
  public List<CustomDtoOne> getJoinedFileRecordsDtoByEntryId(Integer entryId) {
    return this.customDtoOneRepository.findJoinedByEntryId(entryId);
  }

  @Override
  public AccessInfo getMetadataByEntryId(Integer entryId) {
    return this.customDtoOneRepository.getAccessInfoByEntryId(entryId);
  }

  @Override
  public AccessInfo getMetadataByFileId(Integer fileId) {
    return this.customDtoOneRepository.getAccessInfoByFileId(fileId);
  }

  @Override
  public AccessInfo getMetadataByDirectoryId(Integer directoryId) {
    return this.customDtoOneRepository.getAccessInfoByDirectoryId(directoryId);
  }

  @Override
  public List<CustomDtoOne> getFileRecordByDirectoryId(Integer directoryId) {
    return this.customDtoOneRepository.findFileRecordCopiedAtAndDeletedAtByDirectoryId(directoryId);
  }

  @Override
  public List<CustomDtoOne> getFileRecordMetadataByEntryId(Integer entryId) {
    return this.customDtoOneRepository.findFileRecordMetadataByEntryId(entryId);
  }

  @Override
  public void insertFileRecordsAndFileRecordsComputerByDirectoryId(Integer directoryId, Integer computerId,
      List<FileRecord> listFileRecord) {
    try {
      List<Integer> listFileId = this.fileRecordService.bulkCreate(directoryId, listFileRecord);
      List<FileRecordComputer> listFileComputer = new ArrayList<>();
      for (Integer fileId : listFileId) {
        FileRecordComputer fileRecordComputer = FileRecordComputer.builder()
            .fileRecordId(fileId)
            .computerId(computerId)
            .build();
        listFileComputer.add(fileRecordComputer);
      }
      this.fileRecordComputerService.bulkCreate(listFileComputer);
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }
}
