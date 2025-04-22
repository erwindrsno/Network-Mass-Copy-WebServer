package org.custom_dto;

import java.util.List;

import org.entry.Entry;
import org.file_record.FileRecord;
import org.file_record_computer.FileRecordComputer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JoinedEntry {
  Entry entry;
  List<FileRecord> fileRecord;
  List<FileRecordComputer> fileRecordComputer;
}
