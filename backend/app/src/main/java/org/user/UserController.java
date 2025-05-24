package org.user;

import java.util.Map;

import org.slf4j.*;
import io.javalin.http.Context;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class UserController {
  private Logger logger = LoggerFactory.getLogger(UserController.class);
  private final UserService userService;

  @Inject
  public UserController(UserService userService) {
    this.userService = userService;
  }

  public void getAllUsers(Context ctx) {
    ctx.json(this.userService.getAllUsers());
  }

  public void insertUser(Context ctx) {
    String username = ctx.formParam("username");
    String password = ctx.formParam("password");
    String display_name = ctx.formParam("display_name");
    User user = new User(null, username, password, display_name);
    boolean isSucceed = this.userService.createUser(user);
    if (isSucceed) {
      ctx.result("user creation OK").status(201);
    } else {
      ctx.result("username already exists.").status(406);
    }
  }

  public void getUsersById(Context ctx) {
    Integer id = Integer.parseInt(ctx.formParam("id"));
    ctx.json(this.userService.getUsersById(id));
    ctx.status(200);
  }

  public void authUser(Context ctx) {
    String username = ctx.formParam("username");
    String password = ctx.formParam("password");

    User user = User.builder()
        .username(username)
        .password(password)
        .build();
    User authedUser = this.userService.authUser(user);

    if (authedUser != null) {
      String token = this.userService.generateToken(authedUser);
      // ctx.status(200).result(token);
      ctx.json(Map.of("token", token)).status(200);
    } else {
      ctx.result("Log in FAILED").status(401);
    }
  }

  public boolean validateUser(Context ctx) {
    String authHeader = ctx.header("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      ctx.status(401).result("Missing or invalid Authorization header");
      logger.info("Invalid token");
      return false;
    }

    String token = authHeader.substring("Bearer ".length());
    boolean isValidated = this.userService.validateToken(token);
    return isValidated;
  }

  public void deleteUserById(Context ctx) {
    Integer id = Integer.parseInt(ctx.pathParam("id"));
    boolean isDeleted = this.userService.deleteUsersById(id);
    if (isDeleted) {
      ctx.status(200).result("OK");
    } else {
      ctx.status(200).result("NOT OK");
    }
  }

  public void invalidateUser(Context ctx) {
    logger.info("Logging out...");
    ctx.result("Log out OK ").status(200);
    // Integer id = ctx.sessionAttribute("user_id");
    // ctx.req().getSession().invalidate();
    // ctx.result("Log out OK " + id).status(200);
  }

  public void validateSudoAction(Context ctx) {
    String authHeader = ctx.header("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      ctx.status(401).result("Missing or invalid Authorization header");
      logger.info("Invalid token");
    }
    String token = authHeader.substring("Bearer ".length());
    boolean isValidated = this.userService.validateSudoAction(token,
        ctx.formParam("sudo"));

    if (isValidated) {
      ctx.status(200);
    } else {
      ctx.status(401);
    }
  }
}
