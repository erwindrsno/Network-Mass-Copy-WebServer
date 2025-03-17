package org.computer;

import java.util.List;

public interface ComputerService {
    List<Computer> getAllComputers();

    void createComputer(Computer computer);

    List<Computer> getAllComputersByLabNum();
}
