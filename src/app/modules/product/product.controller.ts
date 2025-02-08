import { Request, Response } from "express";
import productService from "./product.service";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import validator from "../../utils/validator.util";
import { Errors } from "validatorjs";
import { checkObjectId } from "../../utils/helpers.util";
/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-06-21
 *
 * Class ProductController
 */
class ProductController {
  /**
   * Show products details by filter
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async showProductsByFilter(
    req: Request,
    res: Response
  ): Promise<void> {
    productService
      .showProductsByFilter(req)
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
   * Get all products shown
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getShowingProducts(req: Request, res: Response): Promise<void> {
    productService
      .getShowingProducts()
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
   * Get showing store products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getShowingStoreProducts(
    req: Request,
    res: Response
  ): Promise<void> {
    const { category, title, slug }: any = req.query;

    productService
      .getShowingStoreProducts(category, title, slug)
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
   * Get products brand
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getAllBrands(req: Request, res: Response): Promise<void> {
    productService.getAllBrands().then((result) => {
      const response = {
        status: statusCode.httpOk,
        data: result,
      };
      return customResponse.success(response, res);
    }).catch((error) => {
      const response = {
        status: error?.status || statusCode.httpInternalServerError,
        errNo: errorNumbers.genericError,
        errMsg: error?.message || error,
      };
      return customResponse.error(response, res);
    });
  }

  /**
   * Create a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-24
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(req: Request, res: Response): Promise<void> {
    const validationRule = {
      sku: "required|string",
      title: "required",
      prices: "required",
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
            productService
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
   * Create a review
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-10-08
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async createReview(req: Request, res: Response): Promise<void> {
    const validationRule = {
      name: "required|string",
      email: "required|email",
      rating: "required",
      comment: "required",
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
            const productId = req.params.productId;

            if (checkObjectId(productId)) {
              productService
                .createReview(productId, req.body)
                .then((result) => {
                  if (result === null || result === undefined) {
                    const response = {
                      status: statusCode.httpNotFound,
                      errNo: errorNumbers.resourceNotFound,
                      errMsg: i18n.__("product.productNotFound"),
                    };

                    return customResponse.error(response, res);
                  } else {
                    const response = {
                      status: statusCode.httpCreated,
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
                errMsg: i18n.__("product.invalidProductId"),
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
   * Create multiple products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-22
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMultiple(req: Request, res: Response): Promise<void> {
    const validationRule = {
      "*": "required",
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
            productService
              .storeMultiple(req.body)
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
   * Get product details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-06-24
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async showProductById(req: Request, res: Response): Promise<void> {
    const productId = req.params.productId;

    if (checkObjectId(productId)) {
      productService
        .showProductById(productId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.productNotFound"),
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
        errMsg: i18n.__("product.invalidProductId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Get product by slug
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getProductBySlug(req: Request, res: Response): Promise<void> {
    const productSlug = req.params.productSlug;

    productService
      .getProductBySlug(productSlug)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("product.productNotFound"),
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
   * Assign a category to a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async assignToCategory(req: Request, res: Response): Promise<void> {
    const productId = req.params.productId;
    const categoryId = req.params.categoryId;

    if (!checkObjectId(productId)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("product.invalidProductId"),
      };

      return customResponse.error(response, res);
    } else if (!checkObjectId(categoryId)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("category.invalidCategoryId"),
      };

      return customResponse.error(response, res);
    } else {
      productService
        .assignToCategory(productId, categoryId)
        .then((result) => {
          if (result === "CATEGORY_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("category.categoryNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "PRODUCT_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.productNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "ALREADY_ASSIGNED") {
            const response = {
              status: statusCode.httpBadRequest,
              errNo: errorNumbers.resourceExist,
              errMsg: i18n.__("product.categoryAlreadyAssigned"),
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
  }

  /**
   * Unassign a category from a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async unassignFromCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    const productId = req.params.productId;
    const categoryId = req.params.categoryId;

    if (!checkObjectId(productId)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("product.invalidProductId"),
      };

      return customResponse.error(response, res);
    } else if (!checkObjectId(categoryId)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("category.invalidCategoryId"),
      };

      return customResponse.error(response, res);
    } else {
      productService
        .unassignFromCategory(productId, categoryId)
        .then((result) => {
          if (result === "CATEGORY_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("category.categoryNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "PRODUCT_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.productNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "NOT_HAVE_THIS_CATEGORY") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.notHaveThisCategory"),
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
  }

  /**
   * Assign a tag to a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async assignToTag(req: Request, res: Response): Promise<void> {
    const productId = req.params.productId;
    const tagId = req.params.tagId;

    if (!checkObjectId(productId)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("product.invalidProductId"),
      };

      return customResponse.error(response, res);
    } else if (!checkObjectId(tagId)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("tag.invalidTagId"),
      };

      return customResponse.error(response, res);
    } else {
      productService
        .assignToTag(productId, tagId)
        .then((result) => {
          if (result === "TAG_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("tag.tagNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "PRODUCT_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.productNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "ALREADY_ASSIGNED") {
            const response = {
              status: statusCode.httpBadRequest,
              errNo: errorNumbers.resourceExist,
              errMsg: i18n.__("product.tagAlreadyAssigned"),
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
  }

  /**
   * Unassign a tag from a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async unassignFromTag(req: Request, res: Response): Promise<void> {
    const productId = req.params.productId;
    const tagId = req.params.tagId;

    if (!checkObjectId(productId)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("product.invalidProductId"),
      };

      return customResponse.error(response, res);
    } else if (!checkObjectId(tagId)) {
      const response = {
        status: statusCode.httpBadRequest,
        errNo: errorNumbers.ivalidResource,
        errMsg: i18n.__("tag.invalidTagId"),
      };

      return customResponse.error(response, res);
    } else {
      productService
        .unassignFromTag(productId, tagId)
        .then((result) => {
          if (result === "TAG_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("tag.tagNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "PRODUCT_NOT_FOUND") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.productNotFound"),
            };

            return customResponse.error(response, res);
          } else if (result === "NOT_HAVE_THIS_TAG") {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.notHaveThisTag"),
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
  }

  /**
   * Update a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    const productId = req.params.productId;
    // check if product id is valid
    if (checkObjectId(productId)) {
      productService
        .update(productId, req.body)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.productNotFound"),
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
        errMsg: i18n.__("product.invalidProductId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Update many products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async updateMany(req: Request, res: Response): Promise<void> {
    productService
      .updateMany(req.body)
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
   * Patch a product
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-22
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async patch(req: Request, res: Response): Promise<void> {
    const productId = req.params.productId;

    // check if product id is valid
    if (checkObjectId(productId)) {
      productService
        .patch(productId, req.body)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.productNotFound"),
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
        errMsg: i18n.__("product.invalidProductId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Delete a product by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const productId = req.params.productId;

    if (checkObjectId(productId)) {
      productService
        .delete(productId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("product.productNotFound"),
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
        errMsg: i18n.__("product.invalidProductId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Delete many products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-21
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async deleteMany(req: Request, res: Response): Promise<void> {
    const productIds = req.params.productIds.split(",");

    productService
      .deleteMany(productIds)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("product.productNotFound"),
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

const productController = new ProductController();
export default productController;
