package org.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
  private Integer id;
  private String username;
  private String password;
  private String display_name;
  private String role;
}
