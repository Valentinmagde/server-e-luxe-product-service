import express, { Router } from "express";
import dotenv from "dotenv";
import routesGrouping from "../../utils/routes-grouping.util";
import profitGridController from "./profit-grid.controller";

dotenv.config();

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-06
 *
 * Class ProfitGridRoutes
 */
class ProfitGridRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   */
  constructor() {
    this.router = express.Router({ mergeParams: true });
  }

  /**
   * Creating all profit grid routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @returns {Router} the profit grid routes
   *
   * @swagger
   * tags:
   *   name: Profit Grid
   *   description: Management of profit grid.
   */
  public profitGridRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/profitGrids",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/profitGrids:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: store
             *     summary: Create a new profit grid.
             *     description: Add profit grid into the system.
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
             *               min_amount:
             *                 type: number
             *                 description: The minimum amount.
             *                 example: 1000
             *               max_amount:
             *                 type: number
             *                 description: The maximum amount.
             *                 example: 2000
             *               gross_rate:
             *                 type: number
             *                 description: The gross rate.
             *                 example: 10
             *               deduction_rate:
             *                 type: number
             *                 description: The deduction rate.
             *                 example: 5
             *               net_rate:
             *                 type: number
             *                 description: The net rate.
             *                 example: 5
             *               status:
             *                 type: string
             *                 description: The status.
             *                 example: show
             *
             *     responses:
             *       201:
             *         description: Profit grid created successfully.
             *         content:
             *           application/json:
             *             schema:
             *               $ref: '#/components/schemas/ProfitGrid'
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
            router.post("/", (req, res) =>
              profitGridController.create(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/profitGrids/showing:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: getShowingProfitGrid
             *     summary: Get all showing profit grid.
             *     description: Get all showing profit grid from the system.
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
             *         description: The profit grid have been successfully
             *                      recovered.
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
             *                      $ref: '#/components/schemas/ProfitGrid'
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
            router.get("/showing", (req, res) =>
              profitGridController.getShowingProfitGrid(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/profitGrids:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: getAll
             *     summary: Get all profit grid.
             *     description: Get all profit grid from the system.
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
             *         description: The profit grid have been successfully
             *                      recovered.
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
             *                      $ref: '#/components/schemas/ProfitGrid'
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
            router.get("/", (req, res) =>
              profitGridController.getAll(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/profitGrids/calculate:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: calculate
             *     summary: Calculate profit based on amount.
             *     description: Calculate profit based on amount.
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
             *               amount:
             *                 type: number
             *                 description: The amount.
             *                 example: 1000
             *               currency:
             *                 type: string
             *                 description: The currency.
             *                 example: EUR
             *
             *     responses:
             *       200:
             *         description: Profit grid created successfully.
             *         content:
             *           application/json:
             *             schema:
             *               $ref: '#/components/schemas/ProfitGrid'
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
            router.post("/calculate", (req, res) =>
              profitGridController.calculate(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/profitGrids/{gridIds}/many:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: deleteMany
             *     summary: Delete many profit grid.
             *     description: Delete many profit grid from the system.
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
             *        name: gridIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The profit grid IDs to be deleted. You can enter several identifiers,
             *            separated by commas
             *
             *     responses:
             *       204:
             *         description: The profit grid has successfully deleted.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: object
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
             *       404:
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
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
            router.delete("/:gridIds/many", (req, res) =>
              profitGridController.deleteMany(req, res)
            );
          })
        );

        router.use(
          "/profitGrid",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/profitGrid/{gridId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: show
             *     summary: Get a profit grid by ID.
             *     description: Get a profit grid by id from the system.
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
             *        name: gridId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the profit grid to get
             *
             *     responses:
             *       200:
             *         description: The profit grid has successfully retrieve.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ProfitGrid'
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
            router.get("/:gridId", (req, res) =>
              profitGridController.getById(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/profitGrid/{gridId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: update
             *     summary: Update a profit grid by ID.
             *     description: Update a profit grid by id from the system.
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
             *        name: gridId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the profit grid to get
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               min_amount:
             *                 type: number
             *                 description: The minimum amount.
             *                 example: 1000
             *               max_amount:
             *                 type: number
             *                 description: The maximum amount.
             *                 example: 2000
             *               gross_rate:
             *                 type: number
             *                 description: The gross rate.
             *                 example: 10
             *               deduction_rate:
             *                 type: number
             *                 description: The deduction rate.
             *                 example: 5
             *               net_rate:
             *                 type: number
             *                 description: The net rate.
             *                 example: 5
             *               status:
             *                 type: string
             *                 description: The status.
             *                 example: show
             *
             *     responses:
             *       200:
             *         description: The profit grid has successfully updated.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ProfitGrid'
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
            router.put("/:gridId", (req, res) =>
              profitGridController.update(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/profitGrid/{gridId}/status:
             *   patch:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: updateStatus
             *     summary: Update the status of a profit grid.
             *     description: Update the status of a profit grid from the system.
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
             *        name: gridId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the profit grid to update
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               status:
             *                 type: string
             *                 description: The status.
             *                 example: show
             *
             *     responses:
             *       200:
             *         description: The profit grid has successfully updated.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ProfitGrid'
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
            router.patch("/:gridId/status", (req, res) =>
              profitGridController.updateStatus(req, res)
            );

            /**
             * @swagger
             * /v1/{lang}/profitGrid/{gridId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags: [Profit Grid]
             *     operationId: delete
             *     summary: Delete a profit grid by ID.
             *     description: Delete a profit grid by id from the system.
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
             *        name: gridId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the profit grid to delete
             *
             *     responses:
             *       200:
             *         description: The profit grid has successfully deleted.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ProfitGrid'
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
             *       404:
             *         description: Not Found.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/404'
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
            router.delete("/:gridId", (req, res) =>
              profitGridController.delete(req, res)
            );
          })
        );
      })
    );
  }
}

const profitGridRoutes = new ProfitGridRoutes();
export default profitGridRoutes;
