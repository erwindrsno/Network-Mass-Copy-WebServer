package org.user;

import java.util.List;

public interface UserService {
  List<User> getAllUsers();

  boolean createUser(User user);

  User getUsersById(Integer id);

  Integer authUser(User user);

  boolean deleteUsersById(Integer id);
}
