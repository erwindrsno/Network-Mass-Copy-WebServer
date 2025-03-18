package org.user;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();

    void createUser(User user);

}
