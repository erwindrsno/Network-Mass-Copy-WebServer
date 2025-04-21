package org.entry;

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
  private Integer userId;
}
