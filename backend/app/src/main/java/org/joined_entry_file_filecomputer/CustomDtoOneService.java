package org.joined_entry_file_filecomputer;

import java.util.List;

import org.file_record.FileRecord;

public interface CustomDtoOneService {
  List<CustomDtoOne> getJoinedFileRecordsDtoByEntryId(Integer entryId);

  AccessInfo getMetadataByEntryId(Integer entryId);

  AccessInfo getMetadataByFileId(Integer fileId);

  AccessInfo getMetadataByDirectoryId(Integer directoryId);

  List<CustomDtoOne> getFileRecordByDirectoryId(Integer directoryId);

  List<CustomDtoOne> getFileRecordMetadataByEntryId(Integer entryId);

  void insertFileRecordsAndFileRecordsComputerByDirectoryId(Integer directoryId, Integer compId,
      List<FileRecord> listFileRecord);
}
