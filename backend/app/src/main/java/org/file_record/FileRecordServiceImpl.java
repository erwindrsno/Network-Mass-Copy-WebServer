package org.file_record;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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
}
