package org.user;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import at.favre.lib.crypto.bcrypt.BCrypt;
import at.favre.lib.crypto.bcrypt.BCrypt.Result;

@Singleton
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

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
  public User authUser(User user) {
    User retrievedUser = this.userRepository.findUserByUsername(user.getUsername());

    // jika username yang diinput tidak ada di db
    if (retrievedUser == null) {
      return null;
    }

    Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), retrievedUser.getPassword());
    if (result.verified == true) {
      return retrievedUser;
    }
    return null;
  }

  @Override
  public String generateToken(User authedUser) {
    try {
      Algorithm algorithm = Algorithm.HMAC512("Secr3t");
      String token = JWT.create()
          .withIssuer("auth0")
          .withClaim("id", authedUser.getId())
          .withClaim("display_name", authedUser.getDisplay_name())
          .withClaim("role", authedUser.getRole())
          .withExpiresAt(new Date(System.currentTimeMillis() + 1 * 60 * 60 * 1000)) // 1 hours
          .sign(algorithm);
      return token;
    } catch (JWTCreationException exception) {
      return null;
    }
  }

  @Override
  public boolean validateToken(String token) {
    DecodedJWT decodedJWT;
    try {
      Algorithm algorithm = Algorithm.HMAC512("Secr3t");
      JWTVerifier verifier = JWT.require(algorithm)
          .withIssuer("auth0")
          .build();
      decodedJWT = verifier.verify(token);
      return true;
    } catch (JWTVerificationException exception) {
      logger.error(exception.getMessage());
      return false;
    }
  }

  @Override
  public boolean validateSudoAction(String token, String password) {
    DecodedJWT decodedJWT;
    try {
      Algorithm algorithm = Algorithm.HMAC512("Secr3t");
      JWTVerifier verifier = JWT.require(algorithm)
          .withIssuer("auth0")
          .build();
      decodedJWT = verifier.verify(token);

      Integer userId = decodedJWT.getClaim("id").asInt();
      String retrievedUserHashedPassword = this.userRepository.findHashedPasswordById(userId);
      Result result = BCrypt.verifyer().verify(password.toCharArray(),
          retrievedUserHashedPassword);
      return result.verified;

    } catch (JWTVerificationException exception) {
      logger.error(exception.getMessage());
      return false;
    }
  }

  @Override
  public Integer getUserIdFromJWT(String token) {
    DecodedJWT decodedJWT;
    try {
      Algorithm algorithm = Algorithm.HMAC512("Secr3t");
      JWTVerifier verifier = JWT.require(algorithm)
          .withIssuer("auth0")
          .build();
      decodedJWT = verifier.verify(token);

      Integer userId = decodedJWT.getClaim("id").asInt();
      return userId;
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }

  @Override
  public String getUserRoleFromJWT(String token) {
    DecodedJWT decodedJWT;
    try {
      Algorithm algorithm = Algorithm.HMAC512("Secr3t");
      JWTVerifier verifier = JWT.require(algorithm)
          .withIssuer("auth0")
          .build();
      decodedJWT = verifier.verify(token);

      String userRole = decodedJWT.getClaim("role").asString();
      return userRole;
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
      return null;
    }
  }
}
