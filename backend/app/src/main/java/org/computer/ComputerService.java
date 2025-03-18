package org.computer;

import java.util.List;

public interface ComputerService {
    List<Computer> getAllComputers();

    void createComputer(Computer computer);

    List<Computer> getAllComputersByLabNum(int lab_num);

    Computer getComputersById(int id);

    Computer getComputersByIpAddress(String ip);
}
