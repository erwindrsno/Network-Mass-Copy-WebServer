package org.joined_entry_file_filecomputer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.computer.Computer;
import org.directory.Directory;
import org.entry.Entry;
import org.entry.EntryRepositoryImpl;
import org.file_record.FileRecord;
import org.file_record_computer.FileRecordComputer;
import org.main.BaseRepository;
import org.main.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.websocket.DirectoryAccessInfo;
import org.websocket.FileAccessInfo;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class CustomDtoOneRepositoryImpl extends BaseRepository<CustomDtoOne> implements CustomDtoOneRepository {
  private Logger logger = LoggerFactory.getLogger(EntryRepositoryImpl.class);

  @Inject
  public CustomDtoOneRepositoryImpl(DatabaseConfig databaseConfig) {
    super(databaseConfig);
  }

  @Override
  public List<CustomDtoOne> findJoinedByEntryId(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      List<CustomDtoOne> listResultSet = new ArrayList<>();
      String query = CustomDtoQuery.FIND_JOINED_BY_ENTRY_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Directory dir = Directory.builder()
            .id(resultSet.getInt("id"))
            .path(resultSet.getString("path"))
            .takeOwnedAt(resultSet.getTimestamp("takeowned_at"))
            .deletedAt(resultSet.getTimestamp("deleted_at"))
            .copied(resultSet.getInt("copied"))
            .fileCount(resultSet.getInt("file_count"))
            .owner(resultSet.getString("owner"))
            .build();

        Computer computer = Computer.builder()
            .id(resultSet.getInt("comp_id"))
            .ip_address(resultSet.getString("ip_address"))
            .host_name(resultSet.getString("host_name"))
            .lab_num(resultSet.getInt("lab_num"))
            .build();

        FileRecordComputer fileRecordComputer = FileRecordComputer.builder()
            .id(resultSet.getInt("file_computer_id"))
            .build();

        CustomDtoOne customDtoOne = CustomDtoOne.builder()
            .directory(dir)
            .computer(computer)
            .fileRecordComputer(fileRecordComputer)
            .build();

        listResultSet.add(customDtoOne);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  // kalo generic nya dalam bentuk CustomDtoOne akan repot, soalnya data ini akan
  // dikirimkan ke server secara langsung.
  // Untuk menghindari pemrosesan pemindahan data dari customDtoOne ke
  // FileAccessInfo, maka pada method ini
  // genericnya akan di set dalam bentuk FileAccessInfo secara langsung.
  @Override
  public AccessInfo getAccessInfoByEntryId(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      List<DirectoryAccessInfo> listDai = new ArrayList<>();
      List<FileAccessInfo> listFai = new ArrayList<>();
      String query = CustomDtoQuery.GET_ACCESS_INFO_BY_ENTRY_ID;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer id = resultSet.getInt("id");
        String filePath = resultSet.getString("path");
        String owner = resultSet.getString("owner");
        Integer permissions = resultSet.getInt("permissions");
        String filename = resultSet.getString("file_name");
        Integer dirId = resultSet.getInt("directory_id");
        String ip_address = resultSet.getString("ip_address");

        String dirPath = resultSet.getString("dir_path");

        FileAccessInfo tempFai = FileAccessInfo.builder()
            .id(id)
            .path(filePath)
            .owner(owner)
            .permissions(permissions)
            .filename(filename)
            .directoryId(dirId)
            .ip_address(ip_address)
            .build();

        listFai.add(tempFai);

        DirectoryAccessInfo tempDai = listDai.stream()
            .filter(dai -> dai.getId().equals(dirId))
            .findFirst()
            .orElse(null);

        if (tempDai == null) {
          tempDai = DirectoryAccessInfo.builder()
              .id(dirId)
              .path(dirPath)
              .owner(owner)
              .build();

          listDai.add(tempDai);
        }
      }
      return new AccessInfo(listFai, listDai);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  @Override
  public AccessInfo getAccessInfoByDirectoryId(Integer directoryId) {
    try (Connection conn = super.getConnection()) {
      List<FileAccessInfo> listFai = new ArrayList<>();
      List<DirectoryAccessInfo> listDai = new ArrayList<>();
      String query = CustomDtoQuery.GET_ACCESS_INFO_BY_DIRECTORY_ID;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, directoryId);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer id = resultSet.getInt("id");
        String filePath = resultSet.getString("path");
        String owner = resultSet.getString("owner");
        Integer permissions = resultSet.getInt("permissions");
        String filename = resultSet.getString("file_name");
        Integer dirId = resultSet.getInt("directory_id");
        String ip_address = resultSet.getString("ip_address");

        FileAccessInfo tempFai = FileAccessInfo.builder()
            .id(id)
            .path(filePath)
            .owner(owner)
            .permissions(permissions)
            .filename(filename)
            .directoryId(dirId)
            .ip_address(ip_address)
            .build();

        listFai.add(tempFai);

        Integer copied = resultSet.getInt("copied");
        Integer fileCount = resultSet.getInt("file_count");
        String dirPath = resultSet.getString("dir_path");
        String dirOwner = resultSet.getString("dir_owner");

        DirectoryAccessInfo tempDai = listDai.stream()
            .filter(dai -> dai.getId().equals(dirId))
            .findFirst()
            .orElse(null);

        if (tempDai == null) {
          tempDai = DirectoryAccessInfo.builder()
              .id(dirId)
              .owner(dirOwner)
              .path(dirPath)
              .build();

          listDai.add(tempDai);
        }
      }
      return new AccessInfo(listFai, listDai);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  @Override
  public AccessInfo getAccessInfoByFileId(Integer fileId) {
    try (Connection conn = super.getConnection()) {
      List<FileAccessInfo> listFai = new ArrayList<>();
      List<DirectoryAccessInfo> listDai = new ArrayList<>();
      String query = CustomDtoQuery.GET_ACCESS_INFO_BY_FILE_ID;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, fileId);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer id = resultSet.getInt("id");
        String filePath = resultSet.getString("path");
        String owner = resultSet.getString("owner");
        Integer permissions = resultSet.getInt("permissions");
        String filename = resultSet.getString("file_name");
        Integer dirId = resultSet.getInt("directory_id");
        String ip_address = resultSet.getString("ip_address");

        FileAccessInfo tempFai = FileAccessInfo.builder()
            .id(id)
            .path(filePath)
            .owner(owner)
            .permissions(permissions)
            .filename(filename)
            .directoryId(dirId)
            .ip_address(ip_address)
            .build();

        listFai.add(tempFai);

        String dirPath = resultSet.getString("dir_path");

        DirectoryAccessInfo tempDai = listDai.stream()
            .filter(dai -> dai.getId().equals(dirId))
            .findFirst()
            .orElse(null);

        if (tempDai == null) {
          tempDai = DirectoryAccessInfo.builder()
              .id(dirId)
              .path(dirPath)
              .build();

          listDai.add(tempDai);
        }
      }
      return new AccessInfo(listFai, listDai);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  @Override
  public List<CustomDtoOne> findFileRecordCopiedAtByDirectoryId(Integer directoryId) {
    try (Connection conn = super.getConnection()) {
      List<CustomDtoOne> listResultSet = new ArrayList<>();
      String query = CustomDtoQuery.FIND_FILE_RECORD_COPIED_AT_BY_DIRECTORY_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, directoryId);

      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        FileRecord fileRecord = FileRecord.builder()
            .id(resultSet.getInt("id"))
            .filename(resultSet.getString("file_name"))
            .permissions(resultSet.getInt("permissions"))
            .filesize(resultSet.getLong("size"))
            .build();

        FileRecordComputer fileRecordComputer = FileRecordComputer.builder()
            .id(resultSet.getInt("file_computer_id"))
            .copiedAt(resultSet.getTimestamp("copied_at"))
            .build();

        CustomDtoOne customDtoOne = CustomDtoOne.builder()
            .fileRecord(fileRecord)
            .fileRecordComputer(fileRecordComputer)
            .build();
        listResultSet.add(customDtoOne);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  @Override
  public List<CustomDtoOne> findFileRecordMetadataByEntryId(Integer entryId) {
    try (Connection conn = super.getConnection()) {
      List<CustomDtoOne> listResultSet = new ArrayList<>();
      String query = CustomDtoQuery.FIND_FILE_RECORD_METADATA_BY_ENTRY_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, entryId);

      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        FileRecord fileRecord = FileRecord.builder()
            .filename(resultSet.getString("file_name"))
            .filesize(resultSet.getLong("size"))
            .permissions(resultSet.getInt("permissions"))
            .build();

        Entry entry = Entry.builder()
            .title(resultSet.getString("title"))
            .basePath(resultSet.getString("base_path"))
            .build();

        Directory directory = Directory.builder()
            .fileCount(resultSet.getInt("file_count"))
            .build();

        CustomDtoOne customDtoOne = CustomDtoOne.builder()
            .fileRecord(fileRecord)
            .entry(entry)
            .directory(directory)
            .build();

        listResultSet.add(customDtoOne);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }
}
