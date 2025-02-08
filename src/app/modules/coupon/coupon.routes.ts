import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import couponController from "./coupon.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2024-07-20
 *
 * Class CouponRoutes
 */
class CouponRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all coupon routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-20
   *
   * @returns {Router} the coupon routes
   */
  public couponRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/coupons",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/coupons:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: allCoupons
             *     summary: Get all coupons.
             *     description: Get all coupons.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     responses:
             *       200:
             *         description: Coupons successfully retrieved.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Coupon'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/", couponController.index);

            /**
             * @swagger
             * /v1/{lang}/coupons:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: store
             *     summary: Add new coupon.
             *     description: Add new coupon.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               title:
             *                type: object
             *                properties:
             *                  en:
             *                    type: string
             *                    description: The coupon's name.
             *                  fr:
             *                    type: string
             *                    description: The coupon's name.
             *               logo:
             *                 type: string
             *                 description: The coupon's logo.
             *               coupon_code:
             *                 type: number
             *                 description: The coupon's code.
             *               start_time:
             *                 type: string
             *                 description: The coupon's start time.
             *               end_time:
             *                 type: string
             *                 description: The coupon's end time.
             *               discount_type:
             *                 type: object
             *                 properties:
             *                   type:
             *                     type: string
             *                     description: The discount type.
             *                   value:
             *                     type: number
             *                     description: The discount value.
             *               minimum_amount:
             *                 type: number
             *                 description: The coupon's minimum amount.
             *               product_type:
             *                 type: string
             *                 description: The coupon's product type.
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *             required:
             *               - name
             *               - slug
             *
             *     responses:
             *       201:
             *         description: Coupon successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Coupon'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       401:
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.post("/", couponController.store);

            /**
             * @swagger
             * /v1/{lang}/coupons/many:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: storeMany
             *     summary: Create many coupons.
             *     description: Create many coupons.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: array
             *             items:
             *               type: object
             *               properties:
             *                 title:
             *                   type: object
             *                   properties:
             *                     en:
             *                       type: string
             *                       description: The coupon's name.
             *                     fr:
             *                       type: string
             *                       description: The coupon's name.
             *                 logo:
             *                   type: string
             *                   description: The coupon's logo.
             *                 coupon_code:
             *                   type: number
             *                   description: The coupon's code.
             *                 start_time:
             *                   type: string
             *                   description: The coupon's start time.
             *                 end_time:
             *                   type: string
             *                   description: The coupon's end time.
             *                 discount_type:
             *                   type: object
             *                   properties:
             *                     type:
             *                       type: string
             *                       description: The discount type.
             *                     value:
             *                       type: number
             *                       description: The discount value.
             *                 minimum_amount:
             *                   type: number
             *                   description: The coupon's minimum amount.
             *                 product_type:
             *                   type: string
             *                   description: The coupon's product type.
             *                 status:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["show", "hide"]
             *                   default: "show"
             *
             *     responses:
             *       201:
             *         description: Coupons created successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Coupon'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.post("/many", couponController.storeMany);

            /**
             * @swagger
             * /v1/{lang}/coupons/showing:
             *   get:
             *     tags:
             *     - Coupon
             *     operationId: getShowing
             *     summary: Get all showing coupons.
             *     description: Get all showing coupons.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     responses:
             *       200:
             *         description: Coupons successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Coupon'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/showing", couponController.getShowingCoupons);

            /**
             * @swagger
             * /v1/{lang}/coupons/many:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: updateMany
             *     summary: Update many coupons.
             *     description: Update many coupons.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: array
             *             items:
             *               type: object
             *               properties:
             *                 _id:
             *                   type: string
             *                   description: The category's ID.
             *                 title:
             *                   type: object
             *                   properties:
             *                     en:
             *                       type: string
             *                       description: The coupon's name.
             *                     fr:
             *                       type: string
             *                       description: The coupon's name.
             *                 logo:
             *                   type: string
             *                   description: The coupon's logo.
             *                 coupon_code:
             *                   type: number
             *                   description: The coupon's code.
             *                 start_time:
             *                   type: string
             *                   description: The coupon's start time.
             *                 end_time:
             *                   type: string
             *                   description: The coupon's end time.
             *                 discount_type:
             *                   type: object
             *                   properties:
             *                     type:
             *                       type: string
             *                       description: The discount type.
             *                     value:
             *                       type: number
             *                       description: The discount value.
             *                 minimum_amount:
             *                   type: number
             *                   description: The coupon's minimum amount.
             *                 product_type:
             *                   type: string
             *                   description: The coupon's product type.
             *                 status:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["show", "hide"]
             *                   default: "show"
             *
             *     responses:
             *       200:
             *         description: Coupon updated successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: array
             *                    items:
             *                      $ref: '#/components/schemas/Coupon'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.put("/many", couponController.updateMany);

            /**
             * @swagger
             * /v1/{lang}/coupons/{couponIds}/many:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: deleteMany
             *     summary: Delete many coupons.
             *     description: Delete many coupons.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: couponIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The category IDs to be deleted. You can enter several identifiers, separated by commas
             *
             *     responses:
             *       204:
             *         description: Coupons deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Coupon'
             *
             *       400:
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       412:
             *         description: Precondition Failed.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/412'
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.delete("/:couponIds/many", couponController.deleteMany);
          })
        );

        router.use(
          "/coupon",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/coupon/{couponId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: byId
             *     summary: Get a coupon by id.
             *     description: Get a coupon by id from the system.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: couponId
             *        schema:
             *          type: string
             *        required: true
             *        description: Coupon's id
             *
             *     responses:
             *       200:
             *         description: The coupon has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Coupon'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/:couponId", couponController.show);

            /**
             * @swagger
             * /v1/{lang}/coupon/code/{couponCode}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: byCode
             *     summary: Get a coupon by code.
             *     description: Get a coupon by code from the system.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: couponCode
             *        schema:
             *          type: string
             *        required: true
             *        description: Coupon's code
             *
             *     responses:
             *       200:
             *         description: The coupon has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Coupon'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/code/:couponCode", couponController.showByCode);

             /**
             * @swagger
             * /v1/{lang}/coupon/{couponId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: update
             *     summary: Update a coupon by ID.
             *     description: Update a coupon by ID.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: couponId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product coupon to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               title:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                     description: The coupon's name.
             *                   fr:
             *                     type: string
             *                     description: The coupon's name.
             *               logo:
             *                 type: string
             *                 description: The coupon's logo.
             *               coupon_code:
             *                 type: number
             *                 description: The coupon's code.
             *               start_time:
             *                 type: string
             *                 description: The coupon's start time.
             *               end_time:
             *                 type: string
             *                 description: The coupon's end time.
             *               discount_type:
             *                 type: object
             *                 properties:
             *                   type:
             *                     type: string
             *                     description: The discount type.
             *                   value:
             *                     type: number
             *                     description: The discount value.
             *               minimum_amount:
             *                 type: number
             *                 description: The coupon's minimum amount.
             *               product_type:
             *                 type: string
             *                 description: The coupon's product type.
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *     responses:
             *       200:
             *         description: The coupon has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Coupon'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.put("/:couponId", couponController.update);

            /**
             * @swagger
             * /v1/{lang}/coupon/{couponId}/status:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: updateStatus
             *     summary: Update a coupon by ID.
             *     description: Update a coupon by ID.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: couponId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product coupon to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/x-www-form-urlencoded:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The category's status.
             *                 enum: ["show", "hide"]
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The category's status.
             *                 enum: ["show", "hide"]
             *     responses:
             *       200:
             *         description: The coupon has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Coupon'
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.put("/:couponId/status", couponController.updateStatus);

            /**
             * @swagger
             * /v1/{lang}/coupon/{couponId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Coupon
             *     operationId: delete
             *     summary: Delete a coupon by ID.
             *     description: Delete a coupon by ID.
             *     parameters:
             *      - in: path
             *        name: lang
             *        schema:
             *          type: string
             *          example: en
             *        required: true
             *        description: Language for the response. Supported
             *          languages ['en', 'fr']
             *      - in: path
             *        name: couponId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the coupon to delete
             *
             *     responses:
             *       204:
             *         description: The coupon deleted successfully.
             *
             *       '400':
             *         description: Bad Request.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/400'
             *
             *       '401':
             *         description: Unauthorized.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/401'
             *
             *       '404':
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
             *
             *       '500':
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.delete("/:couponId", couponController.delete);
          })
        );
      })
    );
  }
}

const couponRoutes = new CouponRoutes();
export default couponRoutes;
