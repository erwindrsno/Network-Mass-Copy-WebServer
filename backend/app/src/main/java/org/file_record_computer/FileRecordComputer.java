package org.file_record_computer;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileRecordComputer {
  private Integer id;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Bangkok")
  private Timestamp copiedAt;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Bangkok")
  private Timestamp takeownedAt;
  private Integer fileRecordId;
  private Integer computerId;

  public FileRecordComputer(Integer fileRecordId, Integer computerId) {
    this.fileRecordId = fileRecordId;
    this.computerId = computerId;
  }

  public FileRecordComputer(Integer id, Timestamp copiedAt, Timestamp takeownedAt) {
    this.id = id;
    this.copiedAt = copiedAt;
    this.takeownedAt = takeownedAt;
  }
}
