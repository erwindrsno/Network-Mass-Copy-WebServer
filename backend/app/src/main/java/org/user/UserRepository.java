package org.user;

import java.util.List;

public interface UserRepository {
    List<User> findAll();

    boolean save(User user);

    User findById(int id);

    Long auth(User user);
}
