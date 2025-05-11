package org.joined_entry_file_filecomputer;

import java.util.List;

import org.websocket.FileAccessInfo;

public interface CustomDtoOneRepository {
  List<CustomDtoOne> findJoinedByEntryIdAndFilename(Integer entryId, String filename);

  List<FileAccessInfo> findPathOwnerPermissionsIpAddressByEntryId(Integer entryId);
}
