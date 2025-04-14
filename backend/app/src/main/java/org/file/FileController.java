package org.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import io.javalin.http.Context;
import io.javalin.util.FileUtil;

@Singleton
public class FileController {
  private Logger logger = LoggerFactory.getLogger(FileController.class);

  @Inject
  public FileController() {

  }

  public void insertFiles(Context ctx) {
    ctx.uploadedFiles()
        .forEach(uploadedFile -> FileUtil.streamToFile(uploadedFile.content(), "upload/" + uploadedFile.filename()));
  }
}
