import { Request, Response } from "express";
import associatedCostService from "./associated-costs.service";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import { checkObjectId } from "../../utils/helpers.util";
import i18n from "../../../core/i18n";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-05
 *
 * Class AssociatedCostController
 */
class AssociatedCostController {
  /**
   * Constructs a new instance of the AssociatedCostController class.
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
   * Get all cost entries
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const costs = await associatedCostService.getAll();
      customResponse.success({ status: statusCode.httpOk, data: costs }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get a cost entry by ID
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const costId = req.params.costId;
      if (checkObjectId(costId)) {
        const cost = await associatedCostService.getById(req.params.costId);

        if (!cost) {
          return customResponse.error(
            {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("cost.notFound"),
            },
            res
          );
        }

        customResponse.success({ status: statusCode.httpOk, data: cost }, res);
      } else {
        return customResponse.error(
          {
            status: statusCode.httpBadRequest,
            errNo: errorNumbers.ivalidResource,
            errMsg: i18n.__("cost.invalidCostId"),
          },
          res
        );
      }
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Create a new cost entry
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const cost = await associatedCostService.create(req.body);
      customResponse.success(
        { status: statusCode.httpCreated, data: cost },
        res
      );
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Update a cost entry by ID
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const cost = await associatedCostService.update(
        req.params.costId,
        req.body
      );

      if (!cost) {
        return customResponse.error(
          {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("cost.notFound"),
          },
          res
        );
      }

      customResponse.success({ status: statusCode.httpOk, data: cost }, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Update a cost entry by ID
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const costId = req.params.costId;
      if (checkObjectId(costId)) {
        associatedCostService
          .updateStatus(costId, req.body)
          .then((result) => {
            if (result === null || result === undefined) {
              const response = {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("cost.notFound"),
              };

              return customResponse.error(response, res);
            } else {
              const response = {
                status: statusCode.httpOk,
                data: result,
              };

              return customResponse.success(response, res);
            }
          })
          .catch((error) => {
            const response = {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            };

            return customResponse.error(response, res);
          });
      } else {
        const response = {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("cost.invalidCostId"),
        };

        return customResponse.error(response, res);
      }
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Delete a cost entry by ID
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const costId = req.params.costId;
      if (checkObjectId(costId)) {
        const result = await associatedCostService.delete(req.params.costId);

        if (!result) {
          return customResponse.error(
            {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("cost.notFound"),
            },
            res
          );
        }

        customResponse.success(
          { status: statusCode.httpNoContent, data: null },
          res
        );
      } else {
        return customResponse.error(
          {
            status: statusCode.httpBadRequest,
            errNo: errorNumbers.ivalidResource,
            errMsg: i18n.__("cost.invalidCostId"),
          },
          res
        );
      }
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Delete many cost entries by IDs
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async deleteMany(req: Request, res: Response): Promise<void> {
    try {
      const ids = req.params.costIds.split(",");
      const result = await associatedCostService.deleteMany(ids);

      if (!result) {
        return customResponse.error(
          {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("cost.notFound"),
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
   * Handle errors consistently
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-05
   *
   * @param {any} error the error
   * @param {Response} res the http response
   *
   * @return {void}
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

export default new AssociatedCostController();
