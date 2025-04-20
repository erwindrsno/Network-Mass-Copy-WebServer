package org.file_record;

import java.util.List;

public interface FileRepository {
  Integer save(File file, Integer entryId);

  List<File> findAll();
}
