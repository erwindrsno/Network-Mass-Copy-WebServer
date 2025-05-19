package org.websocket;

import java.util.List;

import org.joined_entry_file_filecomputer.AccessInfo;

public interface WebSocketClientService {
  void prepareCopyMetadata(Integer entryId, AccessInfo accessInfo);

  void prepareSingleCopyMetadata(Integer entryId, AccessInfo accessInfo);

  void prepareTakeownMetadata(Integer entryId, AccessInfo accessInfo);
}
