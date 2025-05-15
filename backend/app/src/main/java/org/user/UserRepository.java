package org.user;

import java.util.List;

public interface UserRepository {
  List<User> findAll();

  boolean save(User user);

  User findById(Integer id);

  User findUserByUsername(String username);

  boolean destroyById(Integer id);

  String findHashedPasswordById(Integer id);
}
