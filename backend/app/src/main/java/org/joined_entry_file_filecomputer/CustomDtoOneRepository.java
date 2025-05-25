package org.joined_entry_file_filecomputer;

import java.util.List;

import org.file_record.FileRecord;
import org.websocket.FileAccessInfo;

public interface CustomDtoOneRepository {
  List<CustomDtoOne> findJoinedByEntryId(Integer entryId);

  AccessInfo getAccessInfoByEntryId(Integer entryId);

  AccessInfo getAccessInfoByDirectoryId(Integer directoryId);

  AccessInfo getAccessInfoByFileId(Integer fileId);

  List<CustomDtoOne> findFileRecordCopiedAtAndDeletedAtByDirectoryId(Integer directoryId);

  List<CustomDtoOne> findFileRecordMetadataByEntryId(Integer entryId);
}
