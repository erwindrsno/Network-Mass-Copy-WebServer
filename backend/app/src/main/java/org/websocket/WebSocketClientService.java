package org.websocket;

import java.util.List;

public interface WebSocketClientService {
  void prepareMetadata(Integer entryId, String title, List<FileAccessInfo> listFai);
}
