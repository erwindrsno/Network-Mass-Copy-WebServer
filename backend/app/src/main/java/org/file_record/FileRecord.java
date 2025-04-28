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
  private String filename;
  private Integer permissions;
  private long filesize;
  private Integer entryId;

  public FileRecord(String owner, int permissions, String path, String filename, long filesize, Integer entryId) {
    this.owner = owner;
    this.permissions = permissions;
    this.path = path;
    this.filename = filename;
    this.filesize = filesize;
    this.entryId = entryId;
  }

  public FileRecord(Integer id, String filename, long filesize) {
    this.id = id;
    this.filename = filename;
    this.filesize = filesize;
  }

  public FileRecord(Integer id, String path, String owner, Integer permissions) {
    this.id = id;
    this.path = path;
    this.owner = owner;
    this.permissions = permissions;
  }
}
