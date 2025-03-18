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
        List<Computer> listResultSet = new ArrayList<>();
        try (Connection conn = super.getConnection()) {

            String query = "SELECT * FROM computer";
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet resultSet = ps.executeQuery();

            while (resultSet.next()) {
                Long id = resultSet.getLong("id");
                String ip_address = resultSet.getString("ip_address");
                String host_name = resultSet.getString("host_name");
                int lab_num = resultSet.getInt("lab_num");
                Computer computer = new Computer(id, ip_address, host_name, lab_num);
                listResultSet.add(computer);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return listResultSet;
    }

    @Override
    public void save(Computer computer) {
        try (Connection conn = super.getConnection()) {

            String query = "INSERT INTO computer(ip_address, host_name, lab_num) VALUES (?::INET,?,?);";
            PreparedStatement ps = conn.prepareStatement(query);

            ps.setString(1, computer.getIp_address());
            ps.setString(2, computer.getHost_name());
            ps.setInt(3, computer.getLab_num());

            int insertCount = ps.executeUpdate();
            logger.info(insertCount + " rows inserted");
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public List<Computer> findByLabNum(int lab_num) {
        List<Computer> listResultSet = new ArrayList<>();
        try (Connection conn = super.getConnection()) {
            String query = "SELECT * FROM computer WHERE lab_num = ?";

            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, lab_num);

            ResultSet resultSet = ps.executeQuery();

            while (resultSet.next()) {
                Long id = resultSet.getLong("id");
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
    public Computer findById(int id) {
        Computer computer = null;
        try (Connection conn = super.getConnection()) {
            String query = "SELECT * FROM computer WHERE id = ?";

            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, id);

            ResultSet resultSet = ps.executeQuery();

            while (resultSet.next()) {
                Long res_id = resultSet.getLong("id");
                String ip_address = resultSet.getString("ip_address");
                String host_name = resultSet.getString("host_name");
                int res_lab_num = resultSet.getInt("lab_num");
                computer = new Computer(res_id, ip_address, host_name, res_lab_num);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return computer;
    }

    @Override
    public Computer findByIpAddress(String ip) {
        Computer computer = null;
        try (Connection conn = super.getConnection()) {
            String query = "SELECT * FROM computer WHERE ip_address = ?::INET";

            PreparedStatement ps = conn.prepareStatement(query);
            ps.setString(1, ip);

            ResultSet resultSet = ps.executeQuery();

            while (resultSet.next()) {
                Long res_id = resultSet.getLong("id");
                String ip_address = resultSet.getString("ip_address");
                String host_name = resultSet.getString("host_name");
                int res_lab_num = resultSet.getInt("lab_num");
                computer = new Computer(res_id, ip_address, host_name, res_lab_num);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return computer;
    }
}
