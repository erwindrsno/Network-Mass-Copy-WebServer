package org.main;

import static io.javalin.apibuilder.ApiBuilder.*;

import org.computer.ComputerController;
import org.computer.ComputerModule;
import org.main.session.SessionModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.user.UserController;
import org.user.UserModule;
import org.websocket.WebSocketModule;
import org.entry.EntryController;
import org.entry.EntryModule;
import org.file_record.FileRecordController;
import org.file_record.FileRecordModule;
import org.file_record_computer.FileRecordComputerModule;
import org.java_websocket.client.WebSocketClient;
import org.joined_entry_file_filecomputer.CustomDtoOneModule;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.inject.Guice;
import com.google.inject.Injector;

import io.javalin.Javalin;
import io.javalin.http.HandlerType;
import io.javalin.http.UnauthorizedResponse;
import io.javalin.json.JavalinJackson;

public class App {
  private static Logger logger = LoggerFactory.getLogger(App.class);

  public static void main(String[] args) {
    Injector injector = Guice.createInjector(new ComputerModule(), new UserModule(), new DatabaseModule(),
        new SessionModule(), new FileRecordModule(), new EntryModule(), new FileRecordComputerModule(),
        new CustomDtoOneModule(), new WebSocketModule());

    ComputerController computerController = injector.getInstance(ComputerController.class);
    UserController userController = injector.getInstance(UserController.class);
    FileRecordController fileRecordController = injector.getInstance(FileRecordController.class);
    EntryController entryController = injector.getInstance(EntryController.class);
    WebSocketClient webSocketClient = injector.getInstance(WebSocketClient.class);

    try {
      webSocketClient.connectBlocking();
      if (webSocketClient.isOpen()) {
        logger.info("Connected to web socket server");
      }
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }

    Javalin app = Javalin.create(config -> {
      config.jsonMapper(new JavalinJackson().updateMapper(mapper -> {
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
      }));
      config.router.apiBuilder(() -> {
        before(ctx -> {
          ctx.header("Access-Control-Allow-Origin", "http://localhost:3000");
          ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
          ctx.header("Access-Control-Allow-Credentials", "true");
          ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
          if (ctx.method() == HandlerType.OPTIONS) {
            logger.info("before OPTIONS");
            logger.info(ctx.path());
            ctx.status(204);
            ctx.skipRemainingHandlers();
          } else {
            if (!ctx.path().equals("/user/login") && !userController.validateUser(ctx)) {
              throw new UnauthorizedResponse("Unauthorized! Please log in first.");
            }
          }
        });

        path("/user", () -> {
          get(userController::getAllUsers);
          post(userController::insertUser);
          path("/id/{id}", () -> {
            get(userController::getUsersById);
            delete(userController::deleteUserById);
          });
          path("/login", () -> {
            post(userController::authUser);
          });
          path("/logout", () -> {
            post(userController::invalidateUser);
          });
          path("/sudo", () -> {
            post(userController::validateSudoAction);
          });
        });

        path("/computer", () -> {
          get(computerController::getComputers);
          post(computerController::insertComputer);
          path("/lab", () -> {
            path("/", () -> {
              get(computerController::getAllLabNum);
            });
            path("/{num}", () -> {
              get(computerController::getComputersByLabNum);
            });
            get(computerController::getComputersByLabNum);
          });
          path("/id/{id}", () -> {
            get(computerController::getComputersById);
            delete(computerController::deleteComputerById);
          });
          path("/ip_addr/{ip}", () -> {
            get(computerController::getComputersByIpAddress);
          });
        });

        path("/entry", () -> {
          get(entryController::getAllEntries);
          // post(entryController::insertEntry);
          path("/oxam", () -> {
            post(entryController::insertEntry);
          });
          path("/{id}", () -> {
            get(entryController::getFileRecordByEntryId);
            path("/file", () -> {
              get(entryController::getFile);
            });
            // path("/filename/{filename}", () -> {
            // get(entryController::getJoinedFileRecordByEntryIdAndFilename);
            // });
            path("copy", () -> {
              get(entryController::copyFileByEntry);
            });
          });
        });

        path("/file", () -> {
          path("/{id}", () -> {
            get(fileRecordController::getFileInfo);
          });
          path("/download", () -> {
            path("/{entry_id}", () -> {
              path("/{filename}", () -> {
                get(fileRecordController::downloadFile);
              });
            });
          });
        });
      });
    });

    app.error(404, ctx -> {
      ctx.result("Not found 404.");
    });

    app.get("/", ctx -> {
      logger.info("At / now!");
      ctx.result("Hello world!!!");
    });
    app.start(7070);
    logger.info("Server has started!");
  }
}
