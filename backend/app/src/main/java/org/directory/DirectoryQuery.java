package org.directory;

public class DirectoryQuery {
  public static final String SAVE = """
          INSERT INTO directory(path, copied, owner, file_count) VALUES (?,?,?,?);
      """;

  public static final String FIND_BY_ENTRY_ID = """
          SELECT DISTINCT directory.*
          FROM directory
          INNER JOIN file_record ON directory.id = file_record.directory_id
          INNER JOIN entry ON entry.id = file_record.entry_id
          WHERE entry.id = ?
      """;

  public static final String FIND_COPIED_BY_ID = """
          SELECT copied FROM directory WHERE id = ?
      """;

  public static final String UPDATE_COPIED_BY_ID = """
          UPDATE directory
          SET copied = (
              SELECT COUNT(*)
              FROM file_record
              INNER JOIN file_computer
              ON file_record.id = file_computer.file_record_id
              WHERE file_computer.copied_at IS NOT NULL AND directory_id = ?
          )
          WHERE id = ?;
      """;

  public static final String UPDATE_TAKEOWNED_AT_BY_ID = """
           UPDATE directory
           SET takeowned_at = ?
           WHERE id = ?;
      """;

  public static final String UPDATE_DELETED_AT_BY_ID = """
           UPDATE directory
           SET deleted_at = ?
           WHERE id = ?;
      """;
}
