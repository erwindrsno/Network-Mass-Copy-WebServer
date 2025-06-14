package org.entry;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Entry {
  private Integer id;
  private String title;
  private boolean isFromOxam;
  private String basePath;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Bangkok")
  private Timestamp createdAt;
  private Timestamp deletedAt;
  private Integer userId;
  private boolean deleteFiles;
}
