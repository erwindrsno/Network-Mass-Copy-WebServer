package org.file_record;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileRecord {
  private Integer id;
  private String path;
  private String owner;
  private String filename;
  private String permissions;
  private long filesize;
  private Integer entryId;
  private Integer directoryId;
}
