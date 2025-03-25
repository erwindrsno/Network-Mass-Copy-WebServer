package org.user;

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
    logger.info("Username is " + username);
    logger.info("password is " + password);
    User user = new User(username, password);
    Integer user_id = this.userService.authUser(user);

    if (user_id != null) {
      ctx.sessionAttribute("user_id", user_id);
      ctx.result("Log in OK").status(200);
    } else {
      ctx.result("Log in FAILED").status(401);
    }
  }

  public void invalidateUser(Context ctx) {
    Integer id = ctx.sessionAttribute("user_id");
    ctx.req().getSession().invalidate();
    ctx.result("Log out OK " + id).status(200);
  }
}
