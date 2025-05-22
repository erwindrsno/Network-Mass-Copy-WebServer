package org.joined_entry_file_filecomputer;

import org.computer.Computer;
import org.directory.Directory;
import org.entry.Entry;
import org.file_record.FileRecord;
import org.file_record_computer.FileRecordComputer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomDtoOne {
  private Integer entryId;
  private FileRecordComputer fileRecordComputer;
  private FileRecord fileRecord;
  private Computer computer;
  private Directory directory;
  private Entry entry;

  public CustomDtoOne(FileRecord fileRecord, FileRecordComputer fileRecordComputer, Computer computer) {
    this.fileRecordComputer = fileRecordComputer;
    this.fileRecord = fileRecord;
    this.computer = computer;
  }
}
