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
  public List<CustomDtoOne> getJoinedFileRecordsDtoByEntryId(Integer entryId) {
    return this.customDtoOneRepository.findJoinedByEntryId(entryId);
  }

  @Override
  public AccessInfo getMetadataByEntryId(Integer entryId) {
    return this.customDtoOneRepository.findPathOwnerPermissionsIpAddressByEntryId(entryId);
  }

  @Override
  public AccessInfo getMetadataByFileId(Integer fileId) {
    return this.customDtoOneRepository.findPathOwnerPermissionsIpAddressByFileId(fileId);
  }

  @Override
  public AccessInfo getMetadataByDirectoryId(Integer directoryId) {
    return this.customDtoOneRepository.findPathOwnerPermissionsIpAddressByDirectoryId(directoryId);
  }

  @Override
  public List<CustomDtoOne> getFileRecordByDirectoryId(Integer directoryId) {
    return this.customDtoOneRepository.findFileRecordCopiedAtByDirectoryId(directoryId);
  }
}
