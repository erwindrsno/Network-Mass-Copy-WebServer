package org.joined_entry_file_filecomputer;

import java.util.List;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class CustomDtoOneServiceImpl implements CustomDtoOneService {
  private final CustomDtoOneRepository customDtoOneRepository;

  @Inject
  public CustomDtoOneServiceImpl(CustomDtoOneRepository customDtoOneRepository) {
    this.customDtoOneRepository = customDtoOneRepository;
  }

  @Override
  public List<CustomDtoOne> getJoinedFileRecordsDtoByEntryIdAndFilename(Integer entryId, String filename) {
    return this.customDtoOneRepository.findJoinedByEntryIdAndFilename(entryId, filename);
  }
}
