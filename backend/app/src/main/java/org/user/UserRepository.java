package org.user;

import java.util.List;

public interface UserRepository {
    List<User> findAll();

    void save(User user);
}
