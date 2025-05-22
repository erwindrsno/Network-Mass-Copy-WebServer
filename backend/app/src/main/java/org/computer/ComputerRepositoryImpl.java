package org.computer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.main.BaseRepository;
import org.main.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class ComputerRepositoryImpl extends BaseRepository<Computer> implements ComputerRepository {
  private Logger logger = LoggerFactory.getLogger(ComputerRepositoryImpl.class);

  @Inject
  public ComputerRepositoryImpl(DatabaseConfig databaseConfig) {
    super(databaseConfig);
  }

  @Override
  public List<Computer> findAll() {
    try (Connection conn = super.getConnection()) {
      List<Computer> listResultSet = new ArrayList<>();
      String query = ComputerQuery.FIND_ALL;
      PreparedStatement ps = conn.prepareStatement(query);
      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer id = resultSet.getInt("id");
        String ip_address = resultSet.getString("ip_address");
        String host_name = resultSet.getString("host_name");
        int lab_num = resultSet.getInt("lab_num");
        Computer computer = new Computer(id, ip_address, host_name, lab_num);
        listResultSet.add(computer);
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }

  @Override
  public void save(Computer computer) {
    try (Connection conn = super.getConnection()) {
      String query = ComputerQuery.SAVE;
      PreparedStatement ps = conn.prepareStatement(query);

      ps.setString(1, computer.getIp_address());
      ps.setString(2, computer.getHost_name());
      ps.setInt(3, computer.getLab_num());

      int insertCount = ps.executeUpdate();
      if (insertCount == 0)
        throw new Exception("cant insert it!");
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
  }

  @Override
  public List<Computer> findByLabNum(int lab_num) {
    List<Computer> listResultSet = new ArrayList<>();
    try (Connection conn = super.getConnection()) {
      String query = ComputerQuery.FIND_BY_LAB_NUM;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, lab_num);

      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer id = resultSet.getInt("id");
        String ip_address = resultSet.getString("ip_address");
        String host_name = resultSet.getString("host_name");
        int res_lab_num = resultSet.getInt("lab_num");
        Computer computer = new Computer(id, ip_address, host_name, res_lab_num);
        listResultSet.add(computer);
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return listResultSet;
  }

  @Override
  public Computer findById(Integer id) {
    try (Connection conn = super.getConnection()) {
      String query = ComputerQuery.FIND_BY_ID;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, id);

      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer res_id = resultSet.getInt("id");
        String ip_address = resultSet.getString("ip_address");
        String host_name = resultSet.getString("host_name");
        int res_lab_num = resultSet.getInt("lab_num");
        Computer computer = new Computer(res_id, ip_address, host_name, res_lab_num);
        return computer;
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return null;
  }

  @Override
  public Computer findByIpAddress(String ip) {
    try (Connection conn = super.getConnection()) {
      String query = ComputerQuery.FIND_BY_IP_ADDR;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setString(1, ip);

      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer res_id = resultSet.getInt("id");
        String ip_address = resultSet.getString("ip_address");
        String host_name = resultSet.getString("host_name");
        int res_lab_num = resultSet.getInt("lab_num");
        Computer computer = new Computer(res_id, ip_address, host_name, res_lab_num);
        return computer;
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return null;
  }

  @Override
  public Computer findByHostname(String hostname) {
    try (Connection conn = super.getConnection()) {
      String query = ComputerQuery.FIND_BY_HOSTNAME;
      PreparedStatement ps = conn.prepareStatement(query);
      ps.setString(1, hostname);

      ResultSet resultSet = ps.executeQuery();

      while (resultSet.next()) {
        Integer res_id = resultSet.getInt("id");
        String ip_address = resultSet.getString("ip_address");
        String host_name = resultSet.getString("host_name");
        int res_lab_num = resultSet.getInt("lab_num");
        Computer computer = new Computer(res_id, ip_address, host_name, res_lab_num);
        return computer;
      }
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return null;
  }

  @Override
  public boolean destroyById(Integer id) {
    try (Connection conn = super.getConnection()) {
      String query = ComputerQuery.DESTROY_BY_ID;

      PreparedStatement ps = conn.prepareStatement(query);
      ps.setInt(1, id);

      int affectedRows = ps.executeUpdate();
      if (affectedRows == 1) {
        return true;
      }
      return false;
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
    return false;
  }

  @Override
  public List<Integer> findAllLabNum() {
    try (Connection conn = super.getConnection()) {
      List<Integer> listResultSet = new ArrayList<>();
      String query = ComputerQuery.FIND_ALL_LAB_NUM;

      PreparedStatement ps = conn.prepareStatement(query);

      ResultSet resultSet = ps.executeQuery();
      while (resultSet.next()) {
        listResultSet.add(resultSet.getInt("lab_num"));
      }
      return listResultSet;
    } catch (Exception e) {
      logger.error(e.getMessage());
      return null;
    }
  }
}
