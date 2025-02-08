import { Application, Request, Response } from "express";
import swaggerOptions from "../../resources/swagger/product-docs";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import routesGrouping from "../utils/routes-grouping.util";
import statusCode from "../utils/status-code.util";
import errorNumbers from "../utils/error-numbers.util";
import customResponse from "../utils/custom-response.util";
import i18n from "../../core/i18n";
import setLocale from "../middlewares/set-locale.middleware";
import authorization from "../middlewares/authorization.middleware";
import productRoutes from "../modules/product/product.routes";
import categoryRoutes from "../modules/category/category.routes";
import tagRoutes from "../modules/tag/tag.routes";
import couponRoutes from "../modules/coupon/coupon.routes";
import attributeRoutes from "../modules/attribute/attribute.routes";
import extraRoutes from "../modules/extra/extra.routes";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-23-03
 *
 * Class Routes
 */
class Routes {
  private app: Application;
  private specs: object;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-03-23
   *
   * @param {Application} app express application
   */
  constructor(app: Application) {
    this.app = app;
    this.specs = swaggerJSDoc(swaggerOptions);
  }

  /**
   * Creating app Routes starts
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-03-23
   *
   * @returns {void}
   */
  public appRoutes(): void {
    this.app.use(
      "/v1",
      routesGrouping.group((router) => {
        router.use(
          "/:lang",
          setLocale.setLocale,
          authorization.isAuth,
          routesGrouping.group((router) => {
            /******************************************************************
             * Includes all routes here
             ******************************************************************/

            // Product routes
            router.use(productRoutes.productRoutes());

            // Category routes
            router.use(categoryRoutes.categoryRoutes());

            // Tag routes
            router.use(tagRoutes.tagRoutes());

            // Coupons routes
            router.use(couponRoutes.couponRoutes());

            // Attributes routes
            router.use(attributeRoutes.attributeRoutes());

            // Extras routes
            router.use(extraRoutes.extraRoutes());
          })
        );

        // Swagger documentation
        router.use(
          "/producs/docs",
          swaggerUi.serve,
          swaggerUi.setup(this.specs)
        );

        router.get("/products/docs.json", (req, res) => {
          res.setHeader("Content-Type", "application/json");
          res.send(this.specs);
        });
      })
    );

    // error handler for not found router
    this.app.all("*", (req: Request, res: Response) => {
      const response = {
        status: statusCode.httpNotFound,
        errNo: errorNumbers.resourceNotFound,
        errMsg: i18n.__("others.routeNotFound"),
      };

      return customResponse.error(response, res);
    });
  }

  /**
   * Load routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-03-23
   *
   * @returns {void}
   */
  public routesConfig(): void {
    this.appRoutes();
  }
}

export default Routes;
