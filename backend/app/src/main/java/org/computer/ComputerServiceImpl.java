package org.computer;

import java.util.List;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
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
  public List<Computer> getAllComputersByLabNum(int lab_num) {
    return this.computerRepository.findByLabNum(lab_num);
  }

  @Override
  public Computer getComputersById(Integer id) {
    return this.computerRepository.findById(id);
  }

  @Override
  public Computer getComputersByIpAddress(String ip) {
    return this.computerRepository.findByIpAddress(ip);
  }

  @Override
  public Computer getComputersByHostname(String hostname) {
    return this.computerRepository.findByHostname(hostname);
  }

  @Override
  public boolean deleteComputersById(Integer id) {
    return this.computerRepository.destroyById(id);
  }

  @Override
  public List<Integer> getAllLabNum() {
    return this.computerRepository.findAllLabNum();
  }
}
