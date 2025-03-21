package org.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer id;
    private String username;
    private String password;
    private String display_name;

    public User(Integer id, String username, String display_name) {
        this.id = id;
        this.username = username;
        this.display_name = display_name;
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
