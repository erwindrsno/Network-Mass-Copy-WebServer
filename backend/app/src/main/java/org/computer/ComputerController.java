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
    ctx.json(this.computerService.getAllComputers()).status(200);
  }

  public void getAllLabNum(Context ctx) {
    ctx.json(this.computerService.getAllLabNum());
  }

  public void insertComputer(Context ctx) {
    String ip_address = ctx.formParam("ip_address");
    String host_name = ctx.formParam("host_name");
    int lab_num = Integer.parseInt(ctx.formParam("lab_num"));
    Computer computer = new Computer(null, ip_address, host_name, lab_num);
    this.computerService.createComputer(computer);
    ctx.status(201);
  }

  public void getComputersByLabNum(Context ctx) {
    int lab_num = Integer.parseInt(ctx.pathParam("num"));
    logger.info("getComputersByLabNum lab_num : " + lab_num);
    ctx.json(this.computerService.getAllComputersByLabNum(lab_num));
  }

  public void getComputersById(Context ctx) {
    Integer id = Integer.parseInt(ctx.pathParam("id"));
    logger.info("getComputersById id : " + id);
    Computer computer = this.computerService.getComputersById(id);
    if (computer == null) {
      ctx.status(404);
    } else {
      ctx.json(this.computerService.getComputersById(id)).status(200);
    }
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
