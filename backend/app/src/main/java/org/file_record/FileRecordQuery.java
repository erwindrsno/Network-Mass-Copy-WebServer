package org.file_record;

public class FileRecordQuery {
  public static final String SAVE = """
      INSERT INTO file_record(path, owner, file_name, permissions, size, entry_id, directory_id)
      VALUES(?, ?, ?, ?::BIT(3), ?, ?, ?)
          """;

  public static final String FIND_BY_ENTRY_ID = """
      SELECT DISTINCT ON (file_name) id as id, file_name as filename, size as filesize
      FROM file_record WHERE entry_id = ?
      """;

  public static final String FIND_OWNER_BY_ENTRY_ID = """
      SELECT DISTINCT ON(owner) owner from file_record WHERE entry_id = ?
      """;

  public static final String FIND_DIRECTORY_ID_BY_ID = """
      SELECT directory_id FROM file_record WHERE id = ?
      """;

}
