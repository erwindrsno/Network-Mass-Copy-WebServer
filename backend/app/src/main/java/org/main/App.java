package org.main;

import static io.javalin.apibuilder.ApiBuilder.*;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.computer.ComputerController;
import org.computer.ComputerModule;
import org.directory.DirectoryController;
import org.directory.DirectoryModule;
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
import io.javalin.http.sse.SseClient;
import io.javalin.json.JavalinJackson;

public class App {
  private static Logger logger = LoggerFactory.getLogger(App.class);

  public static void main(String[] args) {
    Injector injector = Guice.createInjector(new ComputerModule(), new UserModule(), new MainModule(),
        new FileRecordModule(), new EntryModule(), new FileRecordComputerModule(),
        new CustomDtoOneModule(), new WebSocketModule(), new DirectoryModule());

    ComputerController computerController = injector.getInstance(ComputerController.class);
    UserController userController = injector.getInstance(UserController.class);
    FileRecordController fileRecordController = injector.getInstance(FileRecordController.class);
    EntryController entryController = injector.getInstance(EntryController.class);
    DirectoryController directoryController = injector.getInstance(DirectoryController.class);
    WebSocketClient webSocketClient = injector.getInstance(WebSocketClient.class);
    SseService sseService = injector.getInstance(SseService.class);

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
          ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
          ctx.header("Access-Control-Allow-Credentials", "true");
          ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
          if (ctx.path().equals("/sse") && ctx.cookie("sse").equals("ok")) {
            logger.info("YOU WRE HERE!");
            return;
          }
          if (ctx.method() == HandlerType.OPTIONS) {
            logger.info(ctx.method() + ": " + ctx.path());
            ctx.status(204);
            ctx.skipRemainingHandlers();
          } else {
            if (!ctx.path().equals("/user/login") && !userController.validateUser(ctx)) {
              throw new UnauthorizedResponse("Unauthorized! Please log in first.");
            }
          }
        });

        before("/user", (ctx) -> {
          String userRole = userController.getUserRole(ctx);
          if (ctx.method() == HandlerType.GET || ctx.method() == HandlerType.POST) {
            if (!userRole.equals("superadmin")) {
              throw new UnauthorizedResponse("Unauthorized! Not superadmin.");
            }
          }
        });

        before("/computer", (ctx) -> {
          String userRole = userController.getUserRole(ctx);
          if (ctx.method() == HandlerType.GET || ctx.method() == HandlerType.POST) {
            if (!userRole.equals("superadmin")) {
              throw new UnauthorizedResponse("Unauthorized! Not superadmin.");
            }
          }
        });

        path("/user", () -> {
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

          get(userController::getAllUsers);
          post(userController::insertUser);
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
          post(entryController::createEntry);
          path("/deleted", () -> {
            get(entryController::getAllDeletedEntries);
          });
          path("/oxam", () -> {
            post(entryController::createEntry);
          });
          path("/{id}", () -> {
            get(entryController::getDirectoryRecordByEntryId);
            path("/file", () -> {
              get(entryController::getFile);
            });
            path("/copy", () -> {
              patch(entryController::copyFileByEntry);
            });
            path("takeown", () -> {
              patch(entryController::takeownFileByEntry);
            });
            path("delete", () -> {
              delete(entryController::softDeleteEntryById);
            });
          });
        });

        path("/file", () -> {
          path("/{id}", () -> {
            get(fileRecordController::getFileInfo);
            path("/copy", () -> {
              patch(fileRecordController::copyFile);
            });
            path("/delete", () -> {
              delete(fileRecordController::deleteFile);
            });
          });
          path("/download", () -> {
            path("/{entry_id}", () -> {
              path("/{filename}", () -> {
                get(fileRecordController::downloadFile);
              });
            });
          });
        });

        path("/directory", () -> {
          post(directoryController::createDirectoryByEntryId);
          path("/{directory_id}", () -> {
            get(directoryController::getFileRecordByDirectoryId);
            path("/copy", () -> {
              patch(directoryController::copyFilesByDirectoryId);
            });
            path("/takeown", () -> {
              patch(directoryController::takeownByDirectoryId);
            });
            path("/delete", () -> {
              delete(directoryController::deleteByDirectoryId);
            });
          });
        });
      });
    });

    app.sse("/sse", client -> {
      sseService.addClient(client);
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
