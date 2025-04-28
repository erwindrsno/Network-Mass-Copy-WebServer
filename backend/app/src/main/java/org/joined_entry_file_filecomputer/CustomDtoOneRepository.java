package org.joined_entry_file_filecomputer;

import java.util.List;

public interface CustomDtoOneRepository {
  List<CustomDtoOne> findJoinedByEntryIdAndFilename(Integer entryId, String filename);
}
