import { Router } from "express";
import routesGrouping from "../../utils/routes-grouping.util";
import exchangeRateController from "./exchange-rate.controller";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2025-07-06
 *
 * Class ExchangeRateRoutes
 */
class ExchangeRateRoutes {
  private router: Router;

  /**
   * Create a new Routes instance.
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   */
  constructor() {
    this.router = Router({ mergeParams: true });
  }

  /**
   * Creating all exchange rate routes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2025-07-06
   *
   * @returns {Router} the exchange rate routes
   * @swagger
   * tags:
   *   name: Exchange Rate
   *   description: Management of exchange rate.
   */
  public exchangeRateRoutes(): Router {
    return this.router.use(
      routesGrouping.group((router) => {
        router.use(
          "/exchangeRates",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/exchangeRates:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Exchange Rate]
             *     operationId: getAll
             *     summary: Get all exchange rates.
             *     description: Get all exchange rates from the system.
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
             *         description: The exchange rates have been successfully
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
             *                      $ref: '#/components/schemas/ExchangeRate'
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
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/", exchangeRateController.getAll);

            /**
             * @swagger
             * /v1/{lang}/exchangeRates:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags: [Exchange Rate]
             *     operationId: create
             *     summary: Create a new exchange rate.
             *     description: Create a new exchange rate in the system.
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
             *               from_currency:
             *                 type: string
             *                 description: The currency to convert from.
             *                 example: USD
             *               to_currency:
             *                 type: string
             *                 description: The currency to convert to.
             *                 example: EUR
             *               rate:
             *                 type: number
             *                 description: The exchange rate.
             *                 example: 0.84
             *               fee_percentage:
             *                 type: number
             *                 description: The fee percentage.
             *                 example: 0.02
             *               status:
             *                 type: string
             *                 description: The exchange rate status.
             *                 enum: ["show", "hide"]
             *                 example: show
             *             required:
             *               - from_currency
             *               - to_currency
             *               - rate
             *               - fee_percentage
             *
             *     responses:
             *       201:
             *         description: Exchange rate created successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ExchangeRate'
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
            router.post("/", exchangeRateController.create);

            /**
             * @swagger
             * /v1/{lang}/exchangeRates/convert:
             *   post:
             *     security:
             *      - bearerAuth: []
             *     tags: [Exchange Rate]
             *     operationId: convert
             *     summary: Convert an amount from one currency to another.
             *     description: Convert an amount from one currency to another.
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
             *                 description: The amount to convert.
             *                 example: 100
             *               from:
             *                 type: string
             *                 description: The currency to convert from.
             *                 example: USD
             *               to:
             *                 type: string
             *                 description: The currency to convert to.
             *                 example: EUR
             *             required:
             *               - amount
             *               - from
             *               - to
             *
             *     responses:
             *       200:
             *         description: The amount has been successfully converted.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    type: number
             *                    description: The converted amount.
             *                    example: 84
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
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.post("/convert", exchangeRateController.convert);

            /**
             * @swagger
             * /v1/{lang}/exchangeRates/{rateIds}/many:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags: [Exchange Rate]
             *     operationId: deleteMany
             *     summary: Delete many exchange rates.
             *     description: Delete many exchange rates from the system.
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
             *        name: rateIds
             *        schema:
             *          type: string
             *        required: true
             *        description: The exchange rate IDs to be deleted. You can enter several identifiers,
             *          separated by commas
             *
             *     responses:
             *       204:
             *         description: Exchange rates deleted successfully.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ExchangeRate'
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
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.delete("/:rateIds/many", exchangeRateController.deleteMany);
          })
        );

        router.use(
          "/exchangeRate",
          routesGrouping.group((router) => {
            /**
             * @swagger
             * /v1/{lang}/exchangeRate/{rateId}:
             *   get:
             *     security:
             *      - bearerAuth: []
             *     tags: [Exchange Rate]
             *     operationId: getById
             *     summary: Get an exchange rate by ID.
             *     description: Get an exchange rate by id from the system.
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
             *        name: rateId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the exchange rate to get
             *
             *     responses:
             *       200:
             *         description: The exchange rate has successfully retrieve.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ExchangeRate'
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
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.get("/:rateId", exchangeRateController.getById);

            /**
             * @swagger
             * /v1/{lang}/exchangeRate/{rateId}:
             *   put:
             *     security:
             *      - bearerAuth: []
             *     tags: [Exchange Rate]
             *     operationId: update
             *     summary: Update an exchange rate by ID.
             *     description: Update an exchange rate by id from the system.
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
             *        name: rateId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the exchange rate to update
             *
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               from_currency:
             *                 type: string
             *                 description: The currency to convert from.
             *                 example: USD
             *               to_currency:
             *                 type: string
             *                 description: The currency to convert to.
             *                 example: EUR
             *               rate:
             *                 type: number
             *                 description: The exchange rate.
             *                 example: 0.84
             *               fee_percentage:
             *                 type: number
             *                 description: The fee percentage.
             *                 example: 0.02
             *               status:
             *                 type: string
             *                 description: The exchange rate status.
             *                 enum: ["show", "hide"]
             *                 example: show
             *             required:
             *               - from_currency
             *               - to_currency
             *               - rate
             *               - fee_percentage
             *
             *     responses:
             *       200:
             *         description: The exchange rate has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ExchangeRate'
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
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.put("/:rateId", exchangeRateController.update);

            /**
             * @swagger
             * /v1/{lang}/exchangeRate/{rateId}:
             *   patch:
             *     security:
             *      - bearerAuth: []
             *     tags: [Exchange Rate]
             *     operationId: updateStatus
             *     summary: Update an exchange rate status by ID.
             *     description: Update an exchange rate status by id from the system.
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
             *        name: rateId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the exchange rate to update
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
             *                 description: The exchange rate status.
             *                 enum: ["show", "hide"]
             *             required:
             *               - status
             *
             *     responses:
             *       200:
             *         description: The exchange rate has successfully update.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ExchangeRate'
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
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.patch("/:rateId", exchangeRateController.updateStatus);

            /**
             * @swagger
             * /v1/{lang}/exchangeRate/{rateId}:
             *   delete:
             *     security:
             *      - bearerAuth: []
             *     tags: [Exchange Rate]
             *     operationId: delete
             *     summary: Delete an exchange rate by ID.
             *     description: Delete an exchange rate by id from the system.
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
             *        name: rateId
             *        schema:
             *          type: string
             *        required: true
             *        description: String ID of the exchange rate to delete
             *
             *     responses:
             *       200:
             *         description: The exchange rate has successfully deleted.
             *         content:
             *           application/json:
             *             schema:
             *                type: object
             *                properties:
             *                  status:
             *                    type: string
             *                    example: Ok
             *                  data:
             *                    $ref: '#/components/schemas/ExchangeRate'
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
             *       500:
             *         description: Internal Server Error.
             *         content:
             *          application/json:
             *             schema:
             *              $ref: '#/responses/schemas/500'
             *
             */
            router.delete("/:rateId", exchangeRateController.delete);
          })
        );
      })
    );
  }
}

const exchangeRateRoutes = new ExchangeRateRoutes();
export default exchangeRateRoutes;
