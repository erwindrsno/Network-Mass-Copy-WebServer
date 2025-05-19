package org.file_record;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class FileRecordServiceImpl implements FileRecordService {
  private final FileRecordRepository fileRecordRepository;
  private Logger logger = LoggerFactory.getLogger(FileRecordServiceImpl.class);

  @Inject
  public FileRecordServiceImpl(FileRecordRepository fileRecordRepository) {
    this.fileRecordRepository = fileRecordRepository;
  }

  @Override
  public Integer createFileRecord(FileRecord fileRecord) {
    return this.fileRecordRepository.save(fileRecord);
  }

  @Override
  public List<FileRecord> getFileInfo(Integer entryId) {
    return this.fileRecordRepository.findByEntryId(entryId);
  }

  @Override
  public InputStream downloadFile(Integer entryId, String filename) {
    try {
      Path filePath = Paths.get("upload/" + entryId + "/" + filename);
      logger.info("is file exist: " + Files.exists(filePath));
      if (!Files.exists(filePath)) {
        return null;
      } else {
        return Files.newInputStream(filePath);
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  @Override
  public List<String> getOwnerByEntryId(Integer entryId) {
    return this.fileRecordRepository.findOwnerByEntryId(entryId);
  }

  // to be observe
  @Override
  public void deleteFileById(Integer entryId) {
    Path entryIdPath = Paths.get("upload/" + entryId);
    try (Stream<Path> paths = Files.walk(entryIdPath)) {
      paths
          .sorted(Comparator.reverseOrder()) // delete children before parents
          .forEach(path -> {
            try {
              Files.delete(path);
              System.out.println("Deleted: " + path);
            } catch (IOException e) {
              System.err.println("Failed to delete: " + path + " -> " + e.getMessage());
            }
          });
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
  }

  @Override
  public void deleteByEntryId(Integer entryId) {
    this.fileRecordRepository.destroyByEntryId(entryId);
  }

  @Override
  public Integer getDirectoryIdById(Integer fileId) {
    return this.fileRecordRepository.findDirectoryIdById(fileId);
  }
}
