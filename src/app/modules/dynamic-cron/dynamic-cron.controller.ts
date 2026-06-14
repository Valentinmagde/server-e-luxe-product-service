import { Request, Response } from "express";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import { dynamicCronService } from "./dynamic-cron.service";

class DynamicCronController {
  public async list(req: Request, res: Response): Promise<void> {
    try {
      const crons = await dynamicCronService.list();
      customResponse.success({ status: statusCode.httpOk, data: crons }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const cron = await dynamicCronService.getById(req.params.id);
      if (!cron) {
        customResponse.error({ status: statusCode.httpNotFound, errNo: errorNumbers.genericError, errMsg: "Cron not found" }, res);
        return;
      }
      customResponse.success({ status: statusCode.httpOk, data: cron }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const cron = await dynamicCronService.create(req.body);
      customResponse.success({ status: statusCode.httpCreated, data: cron }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const cron = await dynamicCronService.update(req.params.id, req.body);
      customResponse.success({ status: statusCode.httpOk, data: cron }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async toggle(req: Request, res: Response): Promise<void> {
    try {
      const cron = await dynamicCronService.toggle(req.params.id);
      customResponse.success({ status: statusCode.httpOk, data: cron }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async remove(req: Request, res: Response): Promise<void> {
    try {
      await dynamicCronService.remove(req.params.id);
      customResponse.success({ status: statusCode.httpOk, data: { deleted: true } }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async runNow(req: Request, res: Response): Promise<void> {
    try {
      const cron = await dynamicCronService.runNow(req.params.id);
      customResponse.success({ status: statusCode.httpOk, data: cron }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response): void {
    const response = {
      status: statusCode.httpInternalServerError,
      errNo: errorNumbers.genericError,
      errMsg: error?.message || error,
    };
    customResponse.error(response, res);
  }
}

const dynamicCronController = new DynamicCronController();
export default dynamicCronController;
