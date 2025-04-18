package org.computer;

import org.slf4j.*;
import io.javalin.http.Context;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class ComputerController {
  private Logger logger = LoggerFactory.getLogger(ComputerController.class);
  private final ComputerService computerService;

  @Inject
  public ComputerController(ComputerService computerService) {
    this.computerService = computerService;
  }

  public void getComputers(Context ctx) {
    logger.info("Entered controller");
    ctx.json(this.computerService.getAllComputers());
  }

  public void insertComputer(Context ctx) {
    String ip_address = ctx.formParam("ip_address");
    String host_name = ctx.formParam("host_name");
    int lab_num = Integer.parseInt(ctx.formParam("lab_num"));
    logger.info("ip addr is : " + ip_address);
    logger.info("host_name is : " + host_name);
    logger.info("lab_num is : " + lab_num);
    Computer computer = new Computer(null, ip_address, host_name, lab_num);
    this.computerService.createComputer(computer);
  }

  public void getComputersByLabNum(Context ctx) {
    int lab_num = Integer.parseInt(ctx.pathParam("num"));
    logger.info("getComputersByLabNum lab_num : " + lab_num);
    ctx.json(this.computerService.getAllComputersByLabNum(lab_num));
  }

  public void getComputersById(Context ctx) {
    Integer id = Integer.parseInt(ctx.pathParam("id"));
    logger.info("getComputersById id : " + id);
    ctx.json(this.computerService.getComputersById(id));
  }

  public void getComputersByIpAddress(Context ctx) {
    String ip = ctx.pathParam("ip");
    ctx.json(this.computerService.getComputersByIpAddress(ip));
  }

  public void deleteComputerById(Context ctx) {
    Integer id = Integer.parseInt(ctx.pathParam("id"));
    logger.info("deleteComputersById the id is : " + id);
    boolean isDeleted = this.computerService.deleteComputersById(id);
    if (isDeleted) {
      ctx.status(200).result("OK");
    } else {
      ctx.status(200).result("NOTOK");
    }
  }
}
