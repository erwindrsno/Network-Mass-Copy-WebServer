package org.computer;

import java.util.List;

public interface ComputerRepository {
    List<Computer> findAll();

    void save(Computer computer);

    List<Computer> findByLabNum(int lab_num);

    Computer findById(Integer id);

    Computer findByIpAddress(String ip);

    boolean destroyById(Integer id);
}
