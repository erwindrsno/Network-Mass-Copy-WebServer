package org.joined_entry_file_filecomputer;

public class CustomDtoQuery {
  public static final String FIND_JOINED_BY_ENTRY_ID = """
      SELECT
          directory.id, directory.path, directory.owner, directory.takeowned_at,
          directory.deleted_at, directory.copied, directory.file_count, MIN(computer.id) AS comp_id,
          MIN(computer.host_name) AS host_name, MIN(computer.ip_address) AS ip_address,
          MIN(computer.lab_num) AS lab_num, MIN(file_computer.id) as file_computer_id
      FROM file_record
      INNER JOIN entry ON file_record.entry_id = entry.id
      INNER JOIN file_computer ON file_record.id = file_computer.file_record_id
      INNER JOIN computer ON file_computer.computer_id = computer.id
      INNER JOIN directory ON file_record.directory_id = directory.id
      WHERE entry.id = ?
      GROUP BY
          directory.id
                """;

  public static final String GET_ACCESS_INFO_BY_ENTRY_ID = """
      SELECT
          file_record.id, file_record.path, file_record.owner, file_record.permissions,
          file_record.file_name, file_record.directory_id, computer.ip_address,
          directory.copied, directory.file_count, directory.path AS dir_path,
          directory.owner AS dir_owner
      FROM file_record
      INNER JOIN entry ON file_record.entry_id = entry.id
      INNER JOIN file_computer ON file_record.id = file_computer.file_record_id
      INNER JOIN computer ON file_computer.computer_id = computer.id
      INNER JOIN directory ON directory.id = file_record.directory_id
      WHERE entry.id = ?;
        """;

  public static final String GET_ACCESS_INFO_BY_FILE_ID = """
      SELECT
          file_record.id,
          file_record.path,
          file_record.owner,
          file_record.permissions,
          file_record.file_name,
          file_record.directory_id,
          computer.ip_address,
          directory.copied,
          directory.file_count,
          directory.path AS dir_path
      FROM file_record
      INNER JOIN file_computer ON file_record.id = file_computer.file_record_id
      INNER JOIN computer ON file_computer.computer_id = computer.id
      INNER JOIN directory ON directory.id = file_record.directory_id
      WHERE file_record.id = ?;
        """;

  public static final String GET_ACCESS_INFO_BY_DIRECTORY_ID = """
      SELECT
          file_record.id, file_record.path, file_record.owner, file_record.permissions,
          file_record.file_name, file_record.directory_id, computer.ip_address,
          directory.copied, directory.file_count, directory.path AS dir_path,
          directory.owner AS dir_owner
      FROM file_record
      INNER JOIN file_computer ON file_record.id = file_computer.file_record_id
      INNER JOIN computer ON file_computer.computer_id = computer.id
      INNER JOIN directory ON directory.id = file_record.directory_id
      WHERE directory.id = ?;
        """;

  public static final String FIND_FILE_RECORD_COPIED_AT_AND_DELETED_AT_BY_DIRECTORY_ID = """
      SELECT
          file_record.id AS id, file_record.file_name,
          file_record.permissions, file_record.size,
          file_computer.id AS file_computer_id,
          file_computer.copied_at, file_computer.deleted_at
      FROM file_record
      INNER JOIN file_computer ON file_record.id = file_computer.file_record_id
      WHERE directory_id = ?;
        """;

  public static final String FIND_FILE_RECORD_METADATA_BY_ENTRY_ID = """
      SELECT DISTINCT ON(file_name) file_name, entry.title, entry.base_path, file_record.size, file_record.permissions, directory.file_count
          FROM file_record INNER JOIN entry
          ON file_record.entry_id = entry.id
          INNER JOIN directory
          ON directory.id = file_record.directory_id
          WHERE file_record.entry_id = ?
          ORDER BY file_name
      """;

  public static final String SAVE_FILE_RECORD_BY_DIRECTORY_ID = """
      INSERT INTO file_record (path, owner, entry_id, permissions, size, file_name, directory_id)
              VALUES(?,?,?,?,?,?,?)
      """;
}
