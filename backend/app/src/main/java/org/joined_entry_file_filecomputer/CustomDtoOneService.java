package org.joined_entry_file_filecomputer;

import java.util.List;

import org.websocket.FileAccessInfo;

public interface CustomDtoOneService {
  List<CustomDtoOne> getJoinedFileRecordsDtoByEntryIdAndFilename(Integer entryId, String filename);

  List<FileAccessInfo> getMetadataByEntryId(Integer entryId);
}
