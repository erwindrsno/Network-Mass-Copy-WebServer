package org.computer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Computer {
  private Integer id;
  private String ip_address;
  private String host_name;
  private Integer lab_num;
}
