package org.util;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class TimeUtil {
  private static final ZoneId DEFAULT_ZONE = ZoneId.of("UTC+7");

  public static Timestamp nowTimestamp() {
    return Timestamp.from(ZonedDateTime.now(DEFAULT_ZONE).toInstant());
  }
}
