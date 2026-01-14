import { Request, Response } from "express";
import statusCode from "../../utils/status-code.util";
import customResponse from "../../utils/custom-response.util";
import customizationService from "./customization.service";
import errorNumbers from "../../utils/error-numbers.util";
import validator from "../../utils/validator.util";
import { Errors } from "validatorjs";
import rabbitmqManager from "../../../core/rabbitmq";
import { checkObjectId } from "../../utils/helpers.util";
import i18n from "../../../core/i18n";

/**
 * Customization Controller
 * @module CustomizationController
 */
class CustomizationController {
  /**
   * Get all customization options
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<any>} the customization options
   */
  async getCustomizations(req: Request, res: Response): Promise<any> {
    return customizationService
      .getCustomizations(req.query)
      .then((result) => {
        const response = {
          status: statusCode.httpOk,
          data: result,
        };

        return customResponse.success(response, res);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  /**
   * Get a customization by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<any>} the customization
   */
  async show(req: Request, res: Response): Promise<any> {
    return customizationService
      .show(req.params.customizationId)
      .then((result) => {
        const response = {
          status: statusCode.httpOk,
          data: result,
        };

        return customResponse.success(response, res);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  /**
   * Add a new customization
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-09
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<any>} the customization
   */
  async store(req: Request, res: Response): Promise<any> {
    const validationRule = {
      name: "required",
      email: "email|required",
      notes: "required",
      product_id: "required",
    };
    const reqBody = req.body;

    await validator
      .validator(
        reqBody,
        validationRule,
        {},
        (err: Errors, status: boolean) => {
          if (!status) {
            const response = {
              status: statusCode.httpPreconditionFailed,
              errNo: errorNumbers.validator,
              errMsg: err.errors,
            };

            return customResponse.error(response, res);
          } else {
            (async () => {
              const createdCustomization: any =
                await customizationService.store(reqBody);

              await rabbitmqManager.publishMessage(
                "eluxe.product.createProductCustomizationNotification",
                "createProductCustomizationNotification",
                {
                  request_id: createdCustomization._id,
                  ...reqBody,
                  type: "customization",
                }
              );

              return customResponse.success(
                {
                  status: statusCode.httpCreated,
                  data: createdCustomization,
                },
                res
              );
            })();
          }
        }
      )
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  /**
   * Update a customization
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-09
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<any>} the customization
   */
  async update(req: Request, res: Response): Promise<any> {
    return customizationService
      .update(req.params.customizationId, req.body)
      .then((result) => {
        const response = {
          status: statusCode.httpOk,
          data: result,
        };

        return customResponse.success(response, res);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

   /**
   * Patch a customization
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-14
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async patch(req: Request, res: Response): Promise<void> {
    const { customizationId } = req.params;
    if (checkObjectId(customizationId)) {
      customizationService
        .patch(customizationId, req.body)
        .then((result) => {
          if (!result) {
            return customResponse.error(
              {
                status: statusCode.httpNotFound,
                errNo: errorNumbers.resourceNotFound,
                errMsg: i18n.__("customization.customizationNotFound"),
              },
              res
            );
          } else {
            return customResponse.success(
              {
                status: statusCode.httpOk,
                data: result,
              },
              res
            );
          }
        })
        .catch((error) => {
          return customResponse.error(
            {
              status: error?.status || statusCode.httpInternalServerError,
              errNo: errorNumbers.genericError,
              errMsg: error?.message || error,
            },
            res
          );
        });
    } else {
      return customResponse.error(
        {
          status: statusCode.httpBadRequest,
          errNo: errorNumbers.ivalidResource,
          errMsg: i18n.__("customization.invalidCustomizationId"),
        },
        res
      );
    }
  }

  /**
   * Delete a customization
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2026-01-09
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<any>} the customization
   */
  async delete(req: Request, res: Response): Promise<any> {
    return customizationService
      .delete(req.params.customizationId)
      .then((result) => {
        const response = {
          status: statusCode.httpNoContent,
          data: result,
        };

        return customResponse.success(response, res);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  /**
   * Handle errors
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @param {any} error the error
   * @param {Response} res the http response
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

const customizationController = new CustomizationController();
export default customizationController;
