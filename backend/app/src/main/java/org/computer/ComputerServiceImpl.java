package org.computer;

import java.util.ArrayList;
import java.util.List;

import com.google.inject.Inject;

public class ComputerServiceImpl implements ComputerService {
    private final ComputerRepository computerRepository;

    @Inject
    public ComputerServiceImpl(ComputerRepository computerRepository) {
        this.computerRepository = computerRepository;
    }

    @Override
    public List<Computer> getAllComputers() {
        return this.computerRepository.findAll();
    }

    @Override
    public void createComputer(Computer computer) {
        this.computerRepository.save(computer);
    }

    @Override
    public List<Computer> getAllComputersByLabNum() {
        return this.computerRepository.findByLabNum();
    }
}
