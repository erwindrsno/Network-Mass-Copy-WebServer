package org.user;

import java.util.List;

public interface UserService {
  List<User> getAllUsers();

  boolean createUser(User user);

  User getUsersById(Integer id);

  User authUser(User user);

  boolean deleteUsersById(Integer id);

  String generateToken(User authedUser);

  boolean validateToken(String token, Integer id, String display_name);
}
