package org.file_record_computer;

public class FileRecordComputerQuery {
  public static final String SAVE = """
      INSERT INTO file_computer(file_record_id, computer_id) VALUES(?, ?)
       """;

  public static final String BULK_SAVE = """
      INSERT INTO file_computer(file_record_id, computer_id) VALUES(?, ?)
      """;

  public static final String UPDATE_COPIED_AT_BY_FILE_ID = """
      UPDATE file_computer
      SET copied_at = ?
      FROM file_record
      WHERE file_record.id = file_computer.file_record_id
        AND file_record.id = ?;
      """;

  public static final String UPDATE_DELETED_AT_BY_ID = """
       UPDATE file_computer
       SET deleted_at = ?
       WHERE file_record_id = ?;
      """;
}
