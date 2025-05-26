package org.computer;

public class ComputerQuery {
  public static final String FIND_ALL = """
      SELECT * FROM Computer
      """;

  public static final String SAVE = """
      INSERT INTO computer(ip_address, host_name, lab_num)
          VALUES (?::INET,?,?);
      """;

  public static final String FIND_BY_LAB_NUM = """
      SELECT * FROM computer WHERE lab_num = ?
      """;

  public static final String FIND_BY_ID = """
      SELECT * FROM computer where id = ?
      """;

  public static final String FIND_BY_IP_ADDR = """
      SELECT * FROM computer WHERE ip_address = ?::INET
      """;

  public static final String FIND_BY_HOSTNAME = """
      SELECT * FROM computer WHERE host_name = ?
      """;

  public static final String DESTROY_BY_ID = """
      DELETE FROM computer WHERE id = ?
      """;

  public static final String FIND_ALL_LAB_NUM = """
      SELECT DISTINCT ON(lab_num) lab_num FROM computer ORDER BY lab_num ASC
      """;
}
