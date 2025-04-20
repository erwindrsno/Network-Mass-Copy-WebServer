package org.file_record;

import java.security.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileRecord {
  private Integer id;
  private String path;
  private String owner;
  private int permissions;
  private String copiedAt;
  private String takeownedAt;
  private Integer entryId;
}
