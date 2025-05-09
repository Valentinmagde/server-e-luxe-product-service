import { Request, Response } from "express";
import i18n from "../../../core/i18n";
import customResponse from "../../utils/custom-response.util";
import statusCode from "../../utils/status-code.util";
import errorNumbers from "../../utils/error-numbers.util";
import validator from "../../utils/validator.util";
import { Errors } from "validatorjs";
import { checkObjectId } from "../../utils/helpers.util";
import categoryService from "./category.service";
/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-07-31
 *
 * Class CategoryController
 */
class CategoryController {
  /**
   * Get all categories
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getCategories(req: Request, res: Response): Promise<void> {
    categoryService
      .getCategories()
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
   * Get all category parent and child
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getAllCategory(req: Request, res: Response): Promise<void> {
    categoryService
      .getAllCategory()
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
   * Get category by slug
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-05-07
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getCategoryBySlug(req: Request, res: Response): Promise<void> {
    const categorySlug = req.params.slug;

    categoryService
      .getCategoryBySlug(categorySlug)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("category.categoryNotFound"),
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
   * Create a category
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(req: Request, res: Response): Promise<void> {
    const validationRule = {
      name: "required",
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
            categoryService
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
   * Create many categoryies
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async storeMany(req: Request, res: Response): Promise<void> {
    categoryService
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
   * Get category details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getCategoryById(req: Request, res: Response): Promise<void> {
    const categoryId = req.params.categoryId;

    if (checkObjectId(categoryId)) {
      categoryService
        .getCategoryById(categoryId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("category.categoryNotFound"),
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
        errMsg: i18n.__("category.invalidCategoryId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Get showing category details handler
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getShowingCategories(
    req: Request,
    res: Response
  ): Promise<void> {
    categoryService
      .getShowingCategories()
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("category.categoryNotFound"),
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
   * Get featured categories with product count
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-10-07
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getFeaturedCategories(req: Request, res: Response): Promise<void> {
    categoryService
    .getFeaturedCategories()
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
   * Get categories to display their products on homepage
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-05-10
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getShowingProductsOnHomePageCategories(req: Request, res: Response): Promise<void> {
    categoryService
    .getShowingProductsOnHomePageCategories()
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
   * Get categories with products
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-10-14
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   * @return {Promise<void>} the eventual completion or failure
   */
  public async getCategoriesWithProducts(req: Request, res: Response): Promise<void> {
    categoryService
    .getCategoriesWithProducts()
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
   * Update a category
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-01-07
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async update(req: Request, res: Response): Promise<void> {
    const categoryId = req.params.categoryId;
    // check if role id is valid
    if (checkObjectId(categoryId)) {
      categoryService
        .update(categoryId, req.body)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("category.categoryNotFound"),
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
        errMsg: i18n.__("category.invalidCategoryId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Patch a category
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-10-06
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async patch(req: Request, res: Response): Promise<void> {
    const categoryId = req.params.categoryId;

    // check if product id is valid
    if (checkObjectId(categoryId)) {
      categoryService
        .patch(categoryId, req.body)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("category.categoryNotFound"),
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
        errMsg: i18n.__("category.invalidCategoryId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Update category status
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async updateStatus(req: Request, res: Response): Promise<void> {
    const validationRule = {
      status: "required|string"
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
            const categoryId = req.params.categoryId;
            // check if role id is valid
            if (checkObjectId(categoryId)) {
              categoryService
                .updateStatus(categoryId, req.body)
                .then((result) => {
                  if (result === null || result === undefined) {
                    const response = {
                      status: statusCode.httpNotFound,
                      errNo: errorNumbers.resourceNotFound,
                      errMsg: i18n.__("category.categoryNotFound"),
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
                errMsg: i18n.__("category.invalidCategoryId"),
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
   * Update many categories
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-19
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async updateMany(req: Request, res: Response): Promise<void> {
    categoryService
      .updateMany(req.body)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("category.categoryNotFound"),
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
   * Delete many categories
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const categoryId = req.params.categoryId;

    if (checkObjectId(categoryId)) {
      categoryService
        .delete(categoryId)
        .then((result) => {
          if (result === null || result === undefined) {
            const response = {
              status: statusCode.httpNotFound,
              errNo: errorNumbers.resourceNotFound,
              errMsg: i18n.__("category.categoryNotFound"),
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
        errMsg: i18n.__("category.invalidCategoryId"),
      };

      return customResponse.error(response, res);
    }
  }

  /**
   * Delete many categories
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-07-31
   *
   * @param {Request} req the http request
   * @param {Response} res the http response
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async deleteMany(req: Request, res: Response): Promise<void> {
    const categoryIds = req.params.categoryIds.split(",");

    categoryService
      .deleteMany(categoryIds)
      .then((result) => {
        if (result === null || result === undefined) {
          const response = {
            status: statusCode.httpNotFound,
            errNo: errorNumbers.resourceNotFound,
            errMsg: i18n.__("category.categoryNotFound"),
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

const categoryController = new CategoryController();
export default categoryController;
