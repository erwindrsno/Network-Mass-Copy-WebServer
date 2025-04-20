package org.file_record;

import java.util.List;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class FileServiceImpl implements FileService {
  private final FileRepository fileRepository;

  @Inject
  public FileServiceImpl(FileRepository fileRepository) {
    this.fileRepository = fileRepository;
  }

  @Override
  public Integer createFile(File file, Integer entryId) {
    return this.fileRepository.save(file, entryId);
  }
}
