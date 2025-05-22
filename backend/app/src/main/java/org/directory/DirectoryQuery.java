package org.directory;

public class DirectoryQuery {
  public static final String SAVE = """
      INSERT INTO directory(path, copied, owner, file_count) VALUES (?,?,?,?);
            """;

  public static final String FIND_BY_ENTRY_ID = """
      SELECT DISTINCT directory.*
      FROM directory INNER JOIN file
      ON directory.id = file.directory_id
      INNER JOIN entry
      ON entry.id = file.entry_id
      WHERE entry.id = ?
      """;

  public static final String FIND_COPIED_BY_ID = """
      SELECT copied FROM directory WHERE id = ?
      """;

  public static final String UPDATE_COPIED_BY_ID = """
      UPDATE directory
      SET copied = (
          SELECT COUNT(*)
          FROM file
          INNER JOIN file_computer ON
          file.id = file_computer.file_id
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
