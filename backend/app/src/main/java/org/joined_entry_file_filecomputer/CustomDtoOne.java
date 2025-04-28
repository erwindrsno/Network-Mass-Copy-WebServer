package org.joined_entry_file_filecomputer;

import org.computer.Computer;
import org.file_record.FileRecord;
import org.file_record_computer.FileRecordComputer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomDtoOne {
  private Integer entryId;
  private FileRecordComputer fileRecordComputer;
  private FileRecord fileRecord;
  private Computer computer;

  public CustomDtoOne(FileRecord fileRecord, FileRecordComputer fileRecordComputer, Computer computer) {
    this.fileRecordComputer = fileRecordComputer;
    this.fileRecord = fileRecord;
    this.computer = computer;
  }
}
