import { Request, Response } from "express";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import exchangeRateService from "./exchange-rate.service";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-06
 *
 * Class ExchangeRateController
 */
class ExchangeRateController {
  /**
   * Constructs a new instance of the ExchangeRateController class.
   *
   * @author Valentin magde <valentinmagde@gmail.com>
   * This constructor binds the handleError method to the current instance
   * of the class to ensure the correct `this` context is maintained when the method
   * is used as a callback or event handler.
   */
  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Get all exchange rates
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const rates = await exchangeRateService.getAll();
      customResponse.success({ status: statusCode.httpOk, data: rates }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get exchange rate by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const rate = await exchangeRateService.getById(req.params.rateId);
      customResponse.success({ status: statusCode.httpOk, data: rate }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Create a new exchange rate
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const rate = await exchangeRateService.create(req.body);
      customResponse.success(
        { status: statusCode.httpCreated, data: rate },
        res
      );
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Convert amount between currencies
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async convert(req: Request, res: Response): Promise<void> {
    try {
      const { amount, from, to } = req.body;
      const result = await exchangeRateService.convert(amount, from, to);

      customResponse.success({ status: statusCode.httpOk, data: result }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Update an exchange rate by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const rate = await exchangeRateService.update(
        req.params.rateId,
        req.body
      );
      customResponse.success({ status: statusCode.httpOk, data: rate }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Update an exchange rate status by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const rate = await exchangeRateService.updateStatus(
        req.params.rateId,
        req.body
      );
      customResponse.success({ status: statusCode.httpOk, data: rate }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Delete an exchange rate by ID
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await exchangeRateService.delete(req.params.rateId);

      if (!result) {
        return customResponse.error(
          {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("exchangeRate.exchangeRateNotFound"),
          },
          res
        );
      }

      customResponse.success(
        { status: statusCode.httpNoContent, data: null },
        res
      );
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Delete many exchange rates by IDs
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async deleteMany(req: Request, res: Response): Promise<void> {
    try {
      const ids = req.params.rateIds.split(",");
      const result = await exchangeRateService.deleteMany(ids);

      if (!result) {
        return customResponse.error(
          {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("exchangeRate.exchangeRateNotFound"),
          },
          res
        );
      }

      customResponse.success(
        { status: statusCode.httpNoContent, data: null },
        res
      );
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handle errors
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {any} error the error
   * @param {Response} res the http response
   *
   * @return {void} void
   */
  private handleError(error: any, res: Response): void {
    customResponse.error(
      {
        status: error?.status || statusCode.httpInternalServerError,
        errNo: errorNumbers.genericError,
        errMsg: error?.message || error,
      },
      res
    );
  }
}

export default new ExchangeRateController();
