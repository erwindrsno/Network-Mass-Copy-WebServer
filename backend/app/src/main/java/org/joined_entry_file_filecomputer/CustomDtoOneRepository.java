package org.joined_entry_file_filecomputer;

import java.util.List;
import org.websocket.FileAccessInfo;

public interface CustomDtoOneRepository {
  AccessInfo findPathOwnerPermissionsIpAddressByEntryId(Integer entryId);

  List<CustomDtoOne> findJoinedByEntryId(Integer entryId);

  AccessInfo findPathOwnerPermissionsIpAddressByFileId(Integer fileId);

  AccessInfo findPathOwnerPermissionsIpAddressByDirectoryId(Integer directoryId);

  List<CustomDtoOne> findFileRecordCopiedAtByDirectoryId(Integer directoryId);
}
