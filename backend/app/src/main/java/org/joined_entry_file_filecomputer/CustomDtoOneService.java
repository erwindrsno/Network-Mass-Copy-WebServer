package org.joined_entry_file_filecomputer;

import java.util.List;

public interface CustomDtoOneService {
  List<CustomDtoOne> getJoinedFileRecordsDtoByEntryIdAndFilename(Integer entryId, String filename);
}
