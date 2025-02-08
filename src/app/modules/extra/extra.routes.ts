import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import extraController from "./extra.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2024-11-17
 *
 * Class ExtraRoutes
 */
class ExtraRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all extras routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-11-17
   *
   * @returns {Router} the extras routes
   */
  public extraRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/extras",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/extras:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: allExtras
             *     summary: Get all extras.
             *     description: Get all extras.
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
             *         description: Extras retrieved successfully.
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
             *                      $ref: '#/components/schemas/Extra'
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
            router.get("/", extraController.index);

            /**
             * @swagger
             * /v1/{lang}/extras/showing:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: allShowing
             *     summary: Get all showing extras.
             *     description: Get all showing extras.
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
             *         description: Extras retrieved successfully.
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
             *                      $ref: '#/components/schemas/Extra'
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
            router.get("/showing", extraController.getShowingExtras);

            /**
             * @swagger
             * /v1/{lang}/extras:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Attribute
             *     operationId: store
             *     summary: Add new extra.
             *     description: Add new extra.
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
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                     description: The coupon's title.
             *                   fr:
             *                     type: string
             *                     description: The coupon's title.
             *               name:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                     description: The coupon's name.
             *                   fr:
             *                     type: string
             *                     description: The coupon's name.
             *               option:
             *                 type: object
             *               related_product:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: The related product.
             *               grouped_items:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: The grouped products.
             *               type:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["attribute", "extra"]
             *                 default: "attribute"
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *     responses:
             *       201:
             *         description: Extra successfully created.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Extra'
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
            router.post("/", extraController.store);

            /**
             * @swagger
             * /v1/{lang}/extras/many:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: storeMany
             *     summary: Create many extras.
             *     description: Create many extras.
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
             *                       description: The coupon's title.
             *                     fr:
             *                       type: string
             *                       description: The coupon's title.
             *                 name:
             *                   type: object
             *                   properties:
             *                     en:
             *                       type: string
             *                       description: The coupon's name.
             *                     fr:
             *                       type: string
             *                       description: The coupon's name.
             *                 option:
             *                   type: object
             *                 related_product:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: The related product.
             *                 grouped_items:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: The grouped products.
             *                 type:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["attribute", "extra"]
             *                   default: "attribute"
             *                 status:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["show", "hide"]
             *                   default: "show"
             *
             *     responses:
             *       201:
             *         description: Extras created successfully.
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
             *                      $ref: '#/components/schemas/Extra'
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
            router.post("/many", extraController.storeMany);

            /**
             * @swagger
             * /v1/{lang}/extras/many:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: updateMany
             *     summary: Update many extras.
             *     description: Update many extras.
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
             *                       description: The coupon's title.
             *                     fr:
             *                       type: string
             *                       description: The coupon's title.
             *                 name:
             *                   type: object
             *                   properties:
             *                     en:
             *                       type: string
             *                       description: The coupon's name.
             *                     fr:
             *                       type: string
             *                       description: The coupon's name.
             *                 option:
             *                   type: object
             *                 related_product:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: The related product.
             *                 grouped_items:
             *                   type: array
             *                   items:
             *                     type: string
             *                     description: The grouped products.
             *                 type:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["attribute", "extra"]
             *                   default: "attribute"
             *                 status:
             *                   type: string
             *                   lowercase: true
             *                   enum: ["show", "hide"]
             *                   default: "show"
             *
             *     responses:
             *       200:
             *         description: Extras updated successfully.
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
             *                      $ref: '#/components/schemas/Extra'
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
            router.put("/many", extraController.updateMany);

            /**
             * @swagger
             * /v1/{lang}/extras/{extraIds}/many:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: deleteMany
             *     summary: Delete many extras.
             *     description: Delete many extras.
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
             *        name: extraIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The extra IDs to be deleted. You can enter several identifiers,
             *          separated by commas
             *
             *     responses:
             *       204:
             *         description: Extras deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Extra'
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
            router.delete("/:extraIds/many", extraController.deleteMany);
          })
        );

        router.use(
          "/extra",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/extra/{extraId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: byId
             *     summary: Get a extra by id.
             *     description: Get a extra by id from the system.
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
             *        name: extraId
             *        schema:
             *          type: string
             *        required: true
             *        description: Extra's id
             *
             *     responses:
             *       200:
             *         description: The extra has been successfully obtained.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Extra'
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
            router.get("/:extraId", extraController.show);

            /**
             * @swagger
             * /v1/{lang}/extra/{extraId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: update
             *     summary: Update a extra by ID.
             *     description: Update a extra by ID.
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
             *        name: extraId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the extra to get
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
             *                     description: The coupon's title.
             *                   fr:
             *                     type: string
             *                     description: The coupon's title.
             *               name:
             *                 type: object
             *                 properties:
             *                   en:
             *                     type: string
             *                     description: The coupon's name.
             *                   fr:
             *                     type: string
             *                     description: The coupon's name.
             *               option:
             *                   type: object
             *               related_product:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: The related product.
             *               grouped_items:
             *                 type: array
             *                 items:
             *                   type: string
             *                   description: The grouped products.
             *               type:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["attribute", "extra"]
             *                 default: "attribute"
             *               status:
             *                 type: string
             *                 lowercase: true
             *                 enum: ["show", "hide"]
             *                 default: "show"
             *
             *     responses:
             *       200:
             *         description: The extra has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Extra'
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
            router.put("/:extraId", extraController.update);

            /**
             * @swagger
             * /v1/{lang}/extra/{extraId}/status:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: updateStatus
             *     summary: Update a extra by ID.
             *     description: Update a extra by ID.
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
             *        name: extraId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the product extra to get
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
             *                 description: The extra's status.
             *                 enum: ["show", "hide"]
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The extra's status.
             *                 enum: ["show", "hide"]
             *     responses:
             *       200:
             *         description: The extra has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/Extra'
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
            router.put("/:extraId/status", extraController.updateStatus);

            /**
             * @swagger
             * /v1/{lang}/extra/{extraId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags:
             *     - Extra
             *     operationId: delete
             *     summary: Delete a extra by ID.
             *     description: Delete a extra by ID.
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
             *        name: extraId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the extra to delete
             *
             *     responses:
             *       204:
             *         description: The extra deleted successfully.
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
            router.delete("/:extraId", extraController.delete);
          })
        );
      })
    );
  }
}

const extraRoutes = new ExtraRoutes();
export default extraRoutes;
