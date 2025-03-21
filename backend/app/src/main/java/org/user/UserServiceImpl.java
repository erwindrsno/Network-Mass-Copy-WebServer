package org.user;

import java.util.List;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import at.favre.lib.crypto.bcrypt.*;

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
        String hashedPassword = BCrypt.withDefaults().hashToString(12, user.getPassword().toCharArray());
        user.setPassword(hashedPassword);
        return this.userRepository.save(user);
    }

    @Override
    public User getUsersById(int id) {
        return this.userRepository.findById(id);
    }

    @Override
    public Long authUser(User user) {
        return this.userRepository.auth(user);
    }
}
