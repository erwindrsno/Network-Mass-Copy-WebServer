package org.file_record_computer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileRecordComputer {
  private Integer id;
  private String timestamp;
  private boolean status;
  private Integer fileId;
  private Integer computerId;
}
