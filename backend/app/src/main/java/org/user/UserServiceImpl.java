package org.user;

import java.util.List;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import at.favre.lib.crypto.bcrypt.*;
import at.favre.lib.crypto.bcrypt.BCrypt.Result;

@Singleton
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;

  @Inject
  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public List<User> getAllUsers() {
    return this.userRepository.findAll();
  }

  @Override
  public boolean createUser(User user) {
    User retrievedUser = this.userRepository.findUserByUsername(user.getUsername());

    if (retrievedUser != null)
      return false;

    String hashedPassword = BCrypt.withDefaults().hashToString(12, user.getPassword().toCharArray());
    user.setPassword(hashedPassword);
    return this.userRepository.save(user);
  }

  @Override
  public User getUsersById(Integer id) {
    return this.userRepository.findById(id);
  }

  @Override
  public boolean deleteUsersById(Integer id) {
    return this.userRepository.destroyById(id);
  }

  @Override
  public Integer authUser(User user) {
    User retrievedUser = this.userRepository.findUserByUsername(user.getUsername());

    // jika username yang diinput tidak ada di db
    if (retrievedUser == null)
      return null;

    Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), retrievedUser.getPassword());
    if (result.verified == true) {
      return retrievedUser.getId();
    }
    return null;
  }
}
