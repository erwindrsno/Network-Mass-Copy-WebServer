package org.joined_entry_file_filecomputer;

import java.util.List;

import org.websocket.FileAccessInfo;

public interface CustomDtoOneService {
  // List<CustomDtoOne> getJoinedFileRecordsDtoByEntryIdAndFilename(Integer
  // entryId, String filename);

  List<CustomDtoOne> getJoinedFileRecordsDtoByEntryId(Integer entryId);

  List<FileAccessInfo> getMetadataByEntryId(Integer entryId);
}
