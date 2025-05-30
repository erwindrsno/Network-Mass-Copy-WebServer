package org.user;

public class UserQuery {
  public static final String FIND_ALL = """
      SELECT * FROM users
      """;

  public static final String SAVE = """
      INSERT INTO users(username, password, display_name, role) VALUES (?,?,?,?);
      """;

  public static final String FIND_BY_ID = """
      SELECT * FROM users WHERE id = ?
      """;

  public static final String FIND_BY_USERNAME = """
      SELECT * FROM users WHERE username = ?
      """;

  public static final String DESTROY_BY_ID = """
      DELETE FROM users WHERE id = ?
      """;

  public static final String FIND_PASSWORD_BY_ID = """
      SELECT password FROM users WHERE id = ?
      """;
}
