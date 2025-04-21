package org.file_record;

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

  public FileRecord(String owner, int permissions, String path, Integer entryId) {
    this.owner = owner;
    this.permissions = permissions;
    this.path = path;
    this.entryId = entryId;
  }
}
