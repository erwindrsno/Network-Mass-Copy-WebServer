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
        this.userService.createUser(user);
    }
}
