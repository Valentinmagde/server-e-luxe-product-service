import { Request, Response } from "express";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import validator from "../../utils/validator.util";
import { Errors } from "validatorjs";
import { checkObjectId } from "../../utils/helpers.util";
import couponService from "./coupon.service";
/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2024-07-20
 *
 * Class CouponController
 */
class CouponController {
  /**
   * Get all coupons
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async index(req: Request, res: Response): Promise<void> {
    couponService
      .index()
      .then((result) => {
        const response = {
          status: statusCode.httpOk,
          data: result,
        };

        return customResponse.success(response, res);
      })
      .catch((error) => {
        const response = {
          status: error?.status || statusCode.httpInternalServerError,
          errNo: errorNumbers.genericError,
          errMsg: error?.message || error,
        };

        return customResponse.error(response, res);
      });
  }

  /**
   * Create a coupon
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const validationRule = {
      title: "required",
      coupon_code: "required",
    };

    await validator
      .validator(
        req.body,
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
            couponService
              .store(req.body)
              .then((result) => {
                const response = {
                  status: statusCode.httpCreated,
                  data: result,
                };

                return customResponse.success(response, res);
              })
              .catch((error) => {
                const response = {
                  status: error?.status || statusCode.httpInternalServerError,
                  errNo: errorNumbers.genericError,
                  errMsg: error?.message || error,
                };

                return customResponse.error(response, res);
              });
          }
        }
      )
      .catch((error) => {
        const response = {
          status: error?.status || statusCode.httpInternalServerError,
          errNo: errorNumbers.genericError,
          errMsg: error?.message || error,
        };

        return customResponse.error(response, res);
      });
  }

  /**
   * Create many coupons
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMany(req: Request, res: Response): Promise<void> {
    couponService
      .storeMany(req.body)
      .then((result) => {
        const response = {
          status: statusCode.httpCreated,
          data: result,
        };

        return customResponse.success(response, res);
      })
      .catch((error) => {
        const response = {
          status: error?.status || statusCode.httpInternalServerError,
          errNo: errorNumbers.genericError,
          errMsg: error?.message || error,
        };

        return customResponse.error(response, res);
      });
  }

  /**
   * Get coupon details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async show(req: Request, res: Response): Promise<void> {
    const couponId = req.params.couponId;

    if (checkObjectId(couponId)) {
      couponService
        .show(couponId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("coupon.couponNotFound"),
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
        errMsg: i18n.__("coupon.invalidCouponId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Get coupon details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-12-26
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async showByCode(req: Request, res: Response): Promise<void> {
    const couponCode = req.params.couponCode;

    couponService
      .showByCode(couponCode)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("coupon.couponNotFound"),
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
  }

  /**
   * Get showing coupon details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getShowingCoupons(req: Request, res: Response): Promise<void> {
    couponService
      .getShowingCoupons()
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("coupon.couponNotFound"),
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
  }

  /**
   * Update a coupon
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    const couponId = req.params.couponId;
    // check if role id is valid
    if (checkObjectId(couponId)) {
      couponService
        .update(couponId, req.body)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("coupon.couponNotFound"),
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
        errMsg: i18n.__("coupon.invalidCouponId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Update coupon status
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async updateStatus(req: Request, res: Response): Promise<void> {
    const validationRule = {
      status: "required|string",
    };

    await validator
      .validator(
        req.body,
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
            const couponId = req.params.couponId;
            // check if role id is valid
            if (checkObjectId(couponId)) {
              couponService
                .updateStatus(couponId, req.body)
                .then((result) => {
                  if (result === null || result === undefined) {
                    const response = {
                      status: statusCode.httpNotFound,
                      errNo: errorNumbers.resourceNotFound,
                      errMsg: i18n.__("coupon.couponNotFound"),
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
                errMsg: i18n.__("coupon.invalidCouponId"),
              };

              return customResponse.error(response, res);
            }
          }
        }
      )
      .catch((error) => {
        const response = {
          status: error?.status || statusCode.httpInternalServerError,
          errNo: errorNumbers.genericError,
          errMsg: error?.message || error,
        };

        return customResponse.error(response, res);
      });
  }

  /**
   * Update many coupons
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async updateMany(req: Request, res: Response): Promise<void> {
    couponService
      .updateMany(req.body)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("coupon.couponNotFound"),
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
  }

  /**
   * Delete many coupon
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const couponId = req.params.couponId;

    if (checkObjectId(couponId)) {
      couponService
        .delete(couponId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("coupon.couponNotFound"),
            };

            return customResponse.error(response, res);
          } else {
            const response = {
              status: statusCode.httpNoContent,
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
        errMsg: i18n.__("coupon.invalidCouponId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Delete many coupons
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async deleteMany(req: Request, res: Response): Promise<void> {
    couponService
      .deleteMany(req.body)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("coupon.couponNotFound"),
          };

          return customResponse.error(response, res);
        } else {
          const response = {
            status: statusCode.httpNoContent,
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
  }
}

const couponController = new CouponController();
export default couponController;
