package org.entry;

public class EntryQuery {
  public static final String SAVE = """
      INSERT INTO entry(title, is_from_oxam, count, created_at, delete_files, base_path, user_id)
      VALUES(?, ?, ?, ?, ?, ?, ?)""";

  public static final String FIND_ALL = """
      SELECT * FROM entry WHERE deleted_at IS NULL ORDER BY created_at DESC
        """;

  public static final String FIND_ALL_DELETED = """
      SELECT * FROM entry WHERE deleted_at IS NOT NULL ORDER BY created_at DESC
        """;

  public static final String FIND_TITLE_BY_ID = """
      SELECT title FROM entry WHERE id = ?
      """;

  public static final String UPDATE_DELETABLE_BY_ID = """
      UPDATE entry SET deletable = ? WHERE id = ?
      """;

  public static final String UPDATE_DELETED_AT_BY_ID = """
      UPDATE entry SET deleted_at = ? WHERE id = ?
       """;

  public static final String UPDATE_DELETE_FILES_BY_DIRECTORY_ID = """
      UPDATE entry
      SET delete_files = true
      WHERE delete_files = false AND (
      	SELECT COUNT(*) > 0 AS has_copied_files
      	FROM directory
      	WHERE id = ?
      )
      """;

  public static final String UPDATE_DELETE_FILES_BY_FILE_ID = """
      UPDATE entry
      SET delete_files = true
      WHERE delete_files = false AND (
      	SELECT copied_at IS NOT NULL
      	FROM file_computer
      	WHERE file_computer.file_id = ?
      )
      """;

  public static final String FIND_DELETE_FILES_BY_ID = """
      SELECT delete_files
      FROM entry
      WHERE id = ?
      """;
}
