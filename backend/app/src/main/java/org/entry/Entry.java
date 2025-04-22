package org.entry;

import javax.annotation.Nullable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Entry {
  private Integer id;
  private String title;
  private String completeness;
  private boolean isFromOxam;
  private Integer userId;
  @Nullable
  private Integer permissions;
}
